const { initialized, encode, encrypt, initializeSeal, add, decrypt } = require("../helpers/homomorphicEncryption");
const { getVotes, updateVotes } = require('../models/VotingModel');

exports.vote = async (req, res) => {
	const { nominees, voteArray } = req.body;
	try {
		if (!initialized) {
			await initializeSeal();
		}

		let { encryptedVote: Cipher_B } = getVotes();

		if (!Cipher_B) {
			const Plain_B = await encode([0, 0, 0]);
			Cipher_B = await encrypt(Plain_B);
		}

		const Plain_A = await encode(voteArray);
		const Cipher_A = await encrypt(Plain_A);
		const Cipher_C = await add(Cipher_A, Cipher_B);

		updateVotes(Cipher_C, nominees);
		const PlainC = await decrypt(Cipher_C)

		res.status(200).json({ message: 'Vote received', data: { PlainC } });
	} catch (error) {
		console.error('Error processing vote:', error);
		res.status(500).json({ error: 'Error processing vote' });
	}
};

exports.votes = async (req, res) => {
	try {
		if (!initialized) {
			await initializeSeal();
		}

		const currentVote = getVotes();
		const PlainC = await decrypt(currentVote)
		res.status(200).json({
			nominees: currentVote.nominees,
			voteCount: PlainC
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
};