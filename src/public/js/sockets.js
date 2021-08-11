const socket = io();

const saveNote = (title, description) => {
    socket.emit('client:newnote',{
        title,
        description
    });
}

const updateNote = (id, title, description) => {
    socket.emit('client:updateNote',{id, title, description});
    savedID = ''
}

const deleteNote = id =>{
    socket.emit('client:deleteNote',id);
}

const getNote = (id) => {
    socket.emit('client:getNote', id);
};

socket.on('server:newNote', appendNote);

socket.on('server:loadNotes', renderNotes);

socket.on('server:selectedNote', note =>{
    console.log(note);
    const title = document.querySelector('#title');
    const description = document.querySelector('#description');

    title.value = note.title;
    description.value = note.title;

    savedID = note.id;
});