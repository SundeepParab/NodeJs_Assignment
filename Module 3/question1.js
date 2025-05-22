import express from 'express'
import fs from "fs"
import path from "path"

const app = express();
const PORT = 3000;

// to serve all employee data
app.get('/employee', (req, res) => {
  const filePath = path.join('./employees.json');
  fs.readFile(filePath, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load employee data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'No employee data found' });
    }

    // Parse the JSON data
    res.send(JSON.parse(result));
  });
});

// to serve a specific employee data
app.get('/employee/:id', (req, res) => {
  const employeeId = req.params.id;
  const filePath = path.join('./employees.json');

  fs.readFile(filePath, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load employee data' });
    }

    const employees = JSON.parse(result);
    const employee = employees.find(emp => emp.employee_id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.send(employee);
  });
});


// to serve all project data
app.get('/project', (req, res) => {
  const filePath = path.join('./projects.json');
  fs.readFile(filePath, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load project data' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'No project data found' });
    }

    // Parse the JSON data
    res.send(JSON.parse(result));
  });
});

// to serve a specific project data
app.get('/project/:id', (req, res) => {
  const projectId = req.params.id;
  const filePath = path.join('./projects.json');

  fs.readFile(filePath, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load project data' });
    }

    const projects = JSON.parse(result);
    const project = projects.find(proj => proj.project_id === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project data not found' });
    }
    res.send(project);
  });
});


// to serve a employee and project data
app.get('/getemployeedetails/:id', (req, res) => {
  const employeeId = req.params.id;
  const employeefilePath = path.join('./employees.json');

  fs.readFile(employeefilePath, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load employee data' });
    }

    const employees = JSON.parse(result);
    const employee = employees.find(emp => emp.employee_id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Read the projects.json file
    const projectFilePath = path.join('./projects.json');
    fs.readFile(projectFilePath, (err, projData) => {
      if (err) return res.status(500).json({ error: 'Failed to load project data' });

      const projects = JSON.parse(projData);
      const project = projects.find(proj => proj.project_id === employee.project_id);

      // Merge project info into employee object
      const result = {
        ...employee,
        project_details: project || {}
      };


      res.json(result);
    });
  });
});


// API 3: Get combined employee and project data using fetch + promise
app.get('/fetchemployeedetails', async (req, res) => {
  const employeeId = req.query.id;
  if (!employeeId) return res.status(400).json({ error: 'Employee ID is required' });

  try {
    // Fetch employee
    const empResponse = await fetch(`http://localhost:${PORT}/employee/${employeeId}`);
    if (!empResponse.ok) throw new Error('Failed to fetch employee');

    const employee = await empResponse.json();

    // Fetch project
    const projectResponse = await fetch(`http://localhost:${PORT}/project/${employee.project_id}`);
    if (!projectResponse.ok) throw new Error('Failed to fetch project');

    const project = await projectResponse.json();

    // Combine and return
    res.json({
      ...employee,
      project_details: project
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
