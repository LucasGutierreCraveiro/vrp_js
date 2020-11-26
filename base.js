const UserModel = require('./database/model/User')
const location = require('./language/pt-br.json')

const getsteamIdentifier = () => {
    
    const player = global.source;

    let steamIdentifier = null;

    for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
        const identifier = GetPlayerIdentifier(player, i);

        if (identifier.includes('steam:')) {
            steamIdentifier = identifier;
        }
    }

    return steamIdentifier
}

( ()=>{
    on('playerConnecting', async(name, setKickReason, deferrals) => {
        deferrals.defer()

        deferrals.update(location.deferralsWelcomeMessage);
        
        let source = global.source

        const steamIdentifier = getsteamIdentifier();    
        const User =  await UserModel.findOne({ steamId: steamIdentifier }).populate('characters').exec()

        if(!User) {
            deferrals.update(location.deferralsCreateNewUser)

            const User = new UserModel({
                steamId: steamIdentifier,
                queue_priority: 0,
                banned: false,
                bannedBy: "Não afetado.",
                personLimit: 1
            })

            User.save(function (err) {
                if (err) return deferrals.done(location.deferralsError)

                deferrals.done(location.deferralsFirstLogin)
            })

        } else {

            deferrals.update(location.deferralsCharacterLoad)

            if(User.banned) return deferrals.done(location.deferralsUserBanned)

            if(!User.whitelisted) return deferrals.done(location.deferralsFirstLogin)
            
            if(User.characters.length < 1) {
                emit("vRP:playerJoin", steamIdentifier, source)
                return deferrals.done()
            }

            deferrals.done()
        }
    });
    
})()
