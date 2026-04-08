import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    salary: "",
    status: "Active",
  });

  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ✅ BACKEND URL (LOCAL)
  const API = "https://employeemanagement-d879.onrender.com/employees";

  // ✅ FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API);
      const data = res.data;

      if (data && typeof data === "object") {
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          name: value?.name || "N/A",
          salary: value?.salary || 0,
          status: value?.status || "N/A",
        }));

        setEmployees(list);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ ADD EMPLOYEE
  const addEmployee = async () => {
    if (!form.name || !form.salary) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(API, {
        ...form,
        salary: Number(form.salary), // ✅ FIXED
      });

      setForm({
        name: "",
        salary: "",
        status: "Active",
      });

      fetchEmployees();
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // ✅ DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✅ EDIT EMPLOYEE
  const editEmployee = (emp) => {
    setForm({
      name: emp.name,
      salary: emp.salary,
      status: emp.status,
    });
    setEditId(emp.id);
  };

  // ✅ UPDATE EMPLOYEE
  const updateEmployee = async () => {
    try {
      await axios.put(`${API}/${editId}`, {
        ...form,
        salary: Number(form.salary), // ✅ FIXED
      });

      setEditId(null);
      setForm({
        name: "",
        salary: "",
        status: "Active",
      });

      fetchEmployees();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search employee..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <select className="filter" onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Leave">Leave</option>
        <option value="Resigned">Resigned</option>
      </select>

      {/* FORM */}
      <div className="form-box">
        <input
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option>Active</option>
          <option>Leave</option>
          <option>Resigned</option>
        </select>

        {editId ? (
          <button onClick={updateEmployee}>Update Employee</button>
        ) : (
          <button onClick={addEmployee}>Add Employee</button>
        )}
      </div>

      <h2>Employee List</h2>

      <div className="employee-list">
        {employees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          employees
            .filter(
              (emp) =>
                (filter === "All" || emp.status === filter) &&
                emp.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((emp) => (
              <div className="card" key={emp.id}>
                <p>
                  <strong>Name:</strong> {emp.name}
                </p>
                <p>
                  <strong>Salary:</strong> ₹{emp.salary}
                </p>
                <p>
                  <strong>Status:</strong> {emp.status}
                </p>

                <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
                <button onClick={() => editEmployee(emp)}>Edit</button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default App;
