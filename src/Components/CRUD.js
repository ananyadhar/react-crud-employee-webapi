import React, { useState, useEffect, Fragment } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "@material-ui/core/Card";
import { CardContent, Typography } from "@material-ui/core";


const CRUD = () => {
  const DUMMY_EMPDATA = [
    {
      id: 1,
      name: "Ananya",
      age: 22,
      isActive: 1,
    },
    {
      id: 2,
      name: "Manoj",
      age: 34,
      isActive: 1,
    },
    {
      id: 3,
      name: "Hardik",
      age: 27,
      isActive: 0,
    },
  ];

  //for modal component
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //for adding/creating
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsActive] = useState(0);

  //for editing
  const [editID, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);

  //store the api data
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, [])

  //for get api
  //copy the url which you get from the swagger ui after executing get
  const getData = () => {
    axios.get('https://localhost:7223/api/Employee')
    .then((result) => {
      setData(result.data)
    })
    .catch((error) => {
      console.log(error)
    })
    //this above code will assign the response to variable setShow
  }

  const handleEdit = (id) => {
    // alert(id);
    handleShow();
    axios.get(`https://localhost:7223/api/Employee/${id}`)
    .then((result) => {
      setEditName(result.data.name);
      setEditAge(result.data.age);
      setEditIsActive(result.data.isActive);
      setEditId(id);
    })
    .catch((error) => {
      console.log(error)
    })
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this employee?")) {
      //use `` not ''
      axios.delete(`https://localhost:7223/api/Employee/${id}`)
      .then((result) => {
        if(result.status === 200) {
          toast.success('Employee has been deleted!');
          //use getdata to refresh the list
          getData();
        }
      })
      .catch((error) => {
        toast.success(error);
      })
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7223/api/Employee/${editID}`;
    //create data object
    const data = {
      "id": editID,
      "name": editName,
      "age": editAge,
      "isActive": editIsActive
    }

    axios.put(url, data) 
    .then((result) => {
      //to close the modal pop up after updating
      handleClose();
      getData();
      //after success in our post, clear all the fields
     clear();
     toast.success('Employee has been updated!');
    })
    .catch((error) => {
      toast.success(error);
    })
  };

  const handleSave = () => {
    const url = 'https://localhost:7223/api/Employee';
    const data = {
        "name": name,
        "age": age,
        "isActive": isActive
    }

    axios.post(url, data) 
    .then((result) => {
      getData();
      //after success in our post, clear all the fields
      clear();
      toast.success('Employee has been added!');
    })
    .catch((error) => {
      toast.success(error);
    })
  }

  const clear = () => {
    setName('');
    setAge('');
    setIsActive(0);
    setEditName('');
    setEditAge('');
    setEditIsActive(0);
    setEditId('');

  }

  const handleActiveChange = (e) => {
    if(e.target.checked) {
      setIsActive(1);
    }
    else {
      setIsActive(0);
    }
  }

  const handleEditActiveChange = (e) => {
    if(e.target.checked) {
      setEditIsActive(1);
    }
    else {
      setEditIsActive(0);
    }
  }

  return (
    <Fragment>
      <ToastContainer />
      <div>
        <br />
        <br />
      </div>
      <Card style={{
          backgroundColor: "yellow",
        }}>
      <CardContent>
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive === 1 ? true : false}
              onChange={(e) => handleActiveChange(e)}
              value={isActive}
            />
            <label>Active Employee</label>
          </Col>
          <Col>
            <Button className="btn btn-primary" onClick={() => handleSave()}>
              Submit
            </Button>
          </Col>
        </Row>
      </CardContent>
      </Card>
      <br /> <br />
      {/* use in-built bootstrap table */}
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Age</th>
            <th>Active Employee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive}</td>
                    <td colspan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>{" "}
                      &nbsp;
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "LOADING..."}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={editIsActive === 1 ? true : false}
                onChange={(e) => handleEditActiveChange(e)}
                value={editIsActive}
              />
              <label>Active Employee</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Fragment>
  );
};

export default CRUD;
