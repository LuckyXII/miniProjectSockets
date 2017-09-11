var socket = io();
function newElement(elm) {
    return document.createElement(elm);
}

const voteList = document.getElementById("votesList");
socket.on("updateValues", function (data) {
    voteList.textContent = "";
    for (let party in data) {
        let li = newElement("li");
        li.textContent=`${data[party].party}: ${data[party].votes}`;
        voteList.appendChild(li);
    }
});
