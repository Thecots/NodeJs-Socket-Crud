import express from 'express';
import {Server as WebSocketServer} from 'socket.io';
import http from 'http';
import { v4 as uuid} from 'uuid';

let notes = []

const app = express();
const server = http.createServer(app);
const io = new WebSocketServer(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log(`New connection from ${socket.id}:`);
    socket.emit('server:loadNotes', notes);

    socket.on('client:newnote', (newNote) => {
        const note = {...newNote,id: uuid()};
        notes.push(note);
        io.emit('server:newNote',note)
    });

    socket.on('client:deleteNote', noteid => {
        notes = notes.filter(note => note.id !== noteid);
        io.emit('server:loadNotes', notes);
    })

    socket.on('client:getNote', noteid =>{
        const note = notes.find(note => note.id === noteid);
        socket.emit('server:selectedNote', note);
    })

    socket.on('client:updateNote', (updatedNote) =>{
        console.log(updatedNote);
        notes = notes.map((note) =>{
            if(note.id === updatedNote.id){
                note.title = updatedNote.title;
                note.description = updatedNote.description;
            };
            return note;
        });
        io.emit("server:loadNotes",notes);
    });
})

server.listen(3000, () =>{
    console.log('Server on port', 3000);
});
