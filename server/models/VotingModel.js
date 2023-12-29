let votes = {
  encryptedVote: null,
  nominees: []
};

function getVotes() {
  return votes;
}

function updateVotes(newEncryptedVote, newNominees) {
  votes.encryptedVote = newEncryptedVote;
  votes.nominees = newNominees;
}

module.exports = { getVotes, updateVotes };
