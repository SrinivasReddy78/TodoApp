import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import './App.css'

function App() {
  const [todo, setTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)

  //useEffect hook to handle keydown events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && todo.trim() !== '') {
        handleAdd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [todo]);

  useEffect(() => {
    let todoString = localStorage.getItem('todos');
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);
  
  const saveToLS = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleAdd = () => {
    if (todo.trim() !== '') {
      const newTodo = {
        id: uuidv4(),
        no: todos.length + 1,
        todo,
        isCompleted: false,
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(updatedTodos);
      setTodo('');
      saveToLS(updatedTodos);
    }
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id;
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedTodos = todos.filter((item) => item.id !== id);
      setTodos(updatedTodos);
      saveToLS(updatedTodos);
    }
  };

  const handleEdit = (e, id) => {
    let t = todos.filter(i=>i.id === id);
    setTodo(t[0].todo)
      let updatedTodos = todos.filter(item => item.id !== id);
    setTodos(updatedTodos);
    saveToLS(updatedTodos);
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  return (
    <>
      <div className="w-full h-screen bg-slate-900 flex items-center justify-center" id="main">
        <div className=" bg-zinc-50 h-[80%] rounded-s-sm m-4 text-slate-800 container lg:w-3/4">
          <div className="top-head py-2 flex items-center justify-between select-none border-b border-slate-900 lg:flex-row md:flex-col max-[640px]:flex-col">
            <h1 className='text-3xl font-semibold p-5 max-[640px]:text-xl'>Manage Your Tasks</h1>
            <div className='flex items-center lg:justify-end w-3/4 max-[640px]:justify-center md:justify-center lg:w-1/2'>
              <input onChange={handleChange} value={todo} className='w-3/4 px-3 py-3 border border-slate-950 rounded-md outline-none text-sm' type="text" placeholder='Write Your Task' />
              <button onClick={handleAdd} className='mx-2 my-2 px-3 py-2 bg-yellow-400 text-black text-lg rounded-md '>Add</button>
            </div>
          </div>
          <div className='show flex items-center justify-center border-b border-gray-800 w-1/2 m-auto py-2'>
            <input className='mr-2' onChange={toggleFinished} type="checkbox" name="" checked={showFinished} id="" />Show All Todos
          </div>
          <div className="todos m-2 select-none">
            {todos.length === 0 && <div className='flex items-center justify-center my-10'> Currently You have No Todos to Dispaly</div>}
            {todos.map((item => {

              return (showFinished || !item.isCompleted) && (<div key={item.id} className="todo flex justify-between items-center p-2 border-b border-b-slate-300">
                <div className='flex gap-3 items-center max-[640px]:gap-2'>
                  <span className='border border-orange-400 rounded py-1 px-3 w-8 max-[640px]:text-xs max-[640px]:w-4'>{item.no}</span>
                  <input type="checkbox" onChange={handleCheckbox} name={item.id} id="" checked={item.isCompleted} />
                  <h2 className={`${item.isCompleted ? "line-through" : ""} max-[640px]:text-xs`}>{item.todo}</h2>
                </div>
                <div className="btns flex gap-4 max-[640px]:gap-2">
                  <p className={`status font-semibold border-b border-black px-2 py-1 max-[640px]:text-xs ${item.isCompleted ? 'text-green-400' : 'text-yellow-400'} `}>
                    {item.isCompleted ? "Completed" : "inProgress"}
                  </p>
                  <button onClick={(e) => { handleEdit(e, item.id) }} className='border border-black bg-green-400 px-2 py-1 text-black rounded max-[640px]:text-black'>{window.innerWidth <=600 ?(<MdEdit />) : ('Edit')}</button>
                  <button onClick={(e) => { handleDelete(item.id) }} className='border border-black bg-red-400 px-2 py-1 text-black rounded max-[640px]:text-black'>{window.innerWidth <=600 ?(<MdDelete />) : ('Delete')}</button>
                </div>
              </div>)
            }))}


          </div>
        </div>
      </div>
    </>
  )
}

export default App
