import React, {useState, useEffect} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {

    const [cars, setCars] = useState([]);

    //for Snackbar
    const [open, setOpen] = React.useState(false);

    useEffect(() => fetchData() , []);

    const fetchData = () => {
        fetch('http://carrestapi.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const deleteCar = (link) => {
        if (window.confirm('Are you sure?')){
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.error(err));

            //opens the Snackbar
            setOpen(true);
        }
    };

    const saveCar = (car) => {
        fetch('http://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }


    //function for Snackbar, closes the Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const columns = [
        {
            Header: 'Brand',
            accessor: 'brand'
        },
        {
            Header: 'Model',
            accessor: 'model'
        },
        {
            Header: 'Color',
            accessor: 'color'
        },
        {
            Header: 'Fuel',
            accessor: 'fuel'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            filterable: false,
            sortable: false,
            width: 100,
            Cell: row => <Editcar updateCar={updateCar} car = {row.original}/>
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: row => <div>
                <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => deleteCar(row.value) }>
                    Delete
                </Button>
                <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',}}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Car Deleted"
                />
            </div>
        }
    ]


    return (
        <div>
            <Addcar saveCar={saveCar}/>
            <ReactTable filterable={true} data = {cars} columns = {columns} />
        </div>
    );
}