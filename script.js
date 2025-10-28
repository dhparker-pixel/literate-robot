    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set up the sliders
    const xAxisSlider = document.getElementById('x-axis');
    const yAxisSlider = document.getElementById('y-axis');
    const zAxisSlider = document.getElementById('z-axis');

    // Cube properties
    const cubeSize = 200;
    const halfCube = cubeSize / 2;

    // Dot position
    let dotPosition = { x: 0, y: 0, z: 0 };

    // Rotation angles (in radians)
    let rotationX = -0.7;
    let rotationY = 0.7;
    let rotationZ = 0;

    // Convert 3D coordinates to 2D
    function project(x, y, z) {
        const scale = 200 / (300 + z); // Basic perspective projection
        const projectedX = x * scale + canvas.width / 2;
        const projectedY = y * scale + canvas.height / 2;
        return { x: projectedX, y: projectedY };
    }

    // Apply rotation to the cube's vertices
    function rotateVertex(vertex, rotationX, rotationY, rotationZ) {
        // Rotate around X-axis
        let y = vertex.y * Math.cos(rotationX) - vertex.z * Math.sin(rotationX);
        let z = vertex.y * Math.sin(rotationX) + vertex.z * Math.cos(rotationX);
        vertex.y = y;
        vertex.z = z;

        // Rotate around Y-axis
        let x = vertex.x * Math.cos(rotationY) + vertex.z * Math.sin(rotationY);
        z = -vertex.x * Math.sin(rotationY) + vertex.z * Math.cos(rotationY);
        vertex.x = x;
        vertex.z = z;

        return vertex;
    }

    // Draw the cube
    function drawCube() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define the vertices of the cube
        let vertices = [
            { x: -halfCube, y: -halfCube, z: -halfCube },
            { x: halfCube, y: -halfCube, z: -halfCube },
            { x: halfCube, y: halfCube, z: -halfCube },
            { x: -halfCube, y: halfCube, z: -halfCube },
            { x: -halfCube, y: -halfCube, z: halfCube },
            { x: halfCube, y: -halfCube, z: halfCube },
            { x: halfCube, y: halfCube, z: halfCube },
            { x: -halfCube, y: halfCube, z: halfCube },
        ];

        // Rotate each vertex
        vertices = vertices.map(vertex => rotateVertex(vertex, rotationX, rotationY, rotationZ));

        // Define the edges of the cube (pairs of vertex indices)
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // Front face
            [4, 5], [5, 6], [6, 7], [7, 4], // Back face
            [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
        ];

        // Draw the edges
        ctx.strokeStyle = 'orange';  // Changed to orange to match the style
        ctx.lineWidth = 3;  // Thicker lines for better visibility
        for (let edge of edges) {
            const v1 = project(vertices[edge[0]].x, vertices[edge[0]].y, vertices[edge[0]].z);
            const v2 = project(vertices[edge[1]].x, vertices[edge[1]].y, vertices[edge[1]].z);
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.stroke();
        }

        // Draw the red dot
        const rotatedDot = rotateVertex({ ...dotPosition }, rotationX, rotationY, rotationZ);
        const dot2D = project(rotatedDot.x, rotatedDot.y, rotatedDot.z);

        // Calculate the dot size based on the z-axis value
        const zValue = parseInt(zAxisSlider.value); // Get the current z-axis slider value
        const dotSize = 10 + ((100 - zValue) / 100) * 3; // Dot size ranges from 10px to 40px

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(dot2D.x, dot2D.y, dotSize, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Update the dot's position based on slider values
    function updateDotPosition() {
        dotPosition.x = parseInt(xAxisSlider.value);
        dotPosition.y = parseInt(yAxisSlider.value);
        dotPosition.z = parseInt(zAxisSlider.value);
        drawCube();
    }

    // Add event listeners to sliders
    xAxisSlider.addEventListener('input', updateDotPosition);
    yAxisSlider.addEventListener('input', updateDotPosition);
    zAxisSlider.addEventListener('input', updateDotPosition);

    // Initial draw
    drawCube();
