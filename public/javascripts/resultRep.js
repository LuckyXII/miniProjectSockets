var socket = io();
const sendBtn = document.getElementById("sendReportBtn");
const votes = document.getElementById("votes");
const party = document.getElementById("party");
const district = document.getElementById("district");
sendBtn.addEventListener("click", function () {
    socket.emit("sendData", {
        district: district.value,
        votes: votes.value,
        party: party.value
    });
});