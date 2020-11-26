const { on } = require("../database/model/User");
const Wait = require('../wait');

(() => {

	global.on(
		'onClientGameTypeStart', 
		async (resourceName) => {
			await emitNet('vRP:onClientGameTypeStart')
			
		}
	)


	global.onNet(
		'cliOnClientGameTypeStart', 
		async (characterPosition) => {
			exports.spawnmanagerjs.setAutoSpawnCallback(() => {
				exports.spawnmanagerjs.spawnPlayer({
					x: characterPosition.x, // characterPosition.x
					y: characterPosition.y, // characterPosition.y
					z: characterPosition.z, // characterPosition.z
					model: 'a_m_y_epsilon_02'
				}, (spawn) => {
					console.log(spawn)
				})
			})
		
			exports.spawnmanagerjs.setAutoSpawn(true)
			exports.spawnmanagerjs.forceRespawn()
		}
	)
})()


/**
 * 
 * Bloco da Animação
 * 
 * 
 * @param {*} upper 
 * @param {*} seq 
 * @param {*} looping 
 */

exports.playAnimation = function(upper,seq,looping) {
	let anims = {};
	// let anim_ids = 
	if (seq.task) {
		//para animação aqui
		stopAnimation(true);

		let ped = PlayerPedId()
		if (seq.task == 'PROP_HUMAN_SEAT_CHAIR_MP_PLAYER') {
			const { x, y, z} = getPosition();
			TaskStartScenarioAtPosition(ped,seq.task,x,y,z-1,GetEntityHeading(ped),0,0,false);
		} else {
			TaskStartScenarioInPlace(ped,seq.task,0, seq.play_exit)
		}
	} else {
		stopAnimation(upper)

		let flags = 0
		if (upper) {
			flags = flags + 48; //Entender melhor essas constantes aqui
		}

		if (looping) {
			flags = flags + 1;
		}

		// (()=>{
			
		// }
		// )();

	}
}

exports.stopAnimation = function(upper) {
	let anims = {}
	if (upper) {
		ClearPedSecondaryTask(PlayerPedId());
	} else {
		ClearPedTasks(PlayerPedId());
	}
}

/**
 *  Posicional
 */

exports.getPosition = function() {
	const {x,y,z} = GetEntityCoords(PlayerPadId(),true);
	return {x,y,z};
}

/**
 * Weapons
 */

exports.clearWeapons = function() {
	RemoveAllPedWeapons(PlayerPedId(),true);
}