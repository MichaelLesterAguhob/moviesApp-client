



const [toEdit, setToEdit] = useState('');

const [editTitle, setTitle] = useState('');
const [editDirector, setDirector] = useState('');
const [editYear, setYear] = useState('');
const [editDescription, setDescription] = useState('');
const [editGenre, setGenre] = useState('');
const [editComments, setComments] = useState('');



/* 
    const deleteMovie = async(id) => {
        if(id === null  || !id) {
            return (
                Swal.fire({
                    title: 'Something went wrong.',
                    icon: 'error',
                    timer: 1000
                })
            )
        }

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/deleteWorkout/${id}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || "Failed on deleting workout");
        }

        const data = await response.json();
        if(data) {
            Swal.fire({
                title: 'Deleted successfully',
                icon: 'success',
                timer: 1000
            })
            fetchData();
        }
        
    } */