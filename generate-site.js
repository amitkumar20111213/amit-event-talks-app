// generate-site.js
const fs = require('fs');

const talksData = [
    {
        title: "Introduction to WebAssembly",
        speakers: ["Dr. Evelyn Reed"],
        category: ["Web", "Performance"],
        duration: 60,
        description: "An overview of WebAssembly, its benefits, and how it's changing web development."
    },
    {
        title: "Modern CSS Layouts",
        speakers: ["Liam Foster"],
        category: ["CSS", "Frontend", "Design"],
        duration: 60,
        description: "Explore the latest CSS layout techniques including Grid, Flexbox, and Container Queries."
    },
    {
        title: "State Management in React with Hooks",
        speakers: ["Sophia Chang", "David Lee"],
        category: ["React", "Frontend", "JavaScript"],
        duration: 60,
        description: "Deep dive into managing complex application state using React Hooks and Context API."
    },
    {
        title: "Building Scalable Microservices with Node.js",
        speakers: ["Omar Hassan"],
        category: ["Node.js", "Backend", "Architecture"],
        duration: 60,
        description: "Best practices and patterns for developing resilient and scalable microservices using Node.js."
    },
    {
        title: "AI in Everyday Applications",
        speakers: ["Dr. Anya Sharma"],
        category: ["AI", "Innovation"],
        duration: 60,
        description: "A look at how AI is being integrated into common applications and its future potential."
    },
    {
        title: "Demystifying Cloud Native Development",
        speakers: ["Carlos Ramirez"],
        category: ["Cloud Native", "DevOps"],
        duration: 60,
        description: "Understanding the principles and tools behind cloud-native application development."
    }
];

function calculateSchedule(talks) {
    const schedule = [];
    let currentDateTime = new Date('2026-05-20T10:00:00'); // Event starts at 10:00 AM on an arbitrary date

    talks.forEach((talk, index) => {
        const talkStartTime = new Date(currentDateTime);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + talk.duration);
        const talkEndTime = new Date(currentDateTime);

        schedule.push({
            ...talk,
            startTime: talkStartTime, // Store as Date object
            endTime: talkEndTime     // Store as Date object
        });

        // 10-minute transition after each talk, except the last one
        if (index < talks.length - 1) {
            currentDateTime.setMinutes(currentDateTime.getMinutes() + 10);
        }
    });

    // Insert 1-hour lunch break
    // Assuming lunch is after the 3rd talk (index 2)
    const prevTalkEndTime = schedule[2].endTime; // This is now a Date object
    currentDateTime = new Date(prevTalkEndTime.getTime() + (10 * 60 * 1000)); // 10 min after the 3rd talk ends (Date object)

    const lunchBreakStart = new Date(currentDateTime);
    currentDateTime.setHours(currentDateTime.getHours() + 1);
    const lunchBreakEnd = new Date(currentDateTime);

    schedule.splice(3, 0, { // Insert after the 3rd talk
        title: "Lunch Break",
        speakers: [],
        category: [],
        duration: 60,
        description: "Enjoy your lunch!",
        startTime: lunchBreakStart, // Store as Date object
        endTime: lunchBreakEnd,     // Store as Date object
        isBreak: true
    });

    // Adjust subsequent talk times after lunch
    // currentDateTime already holds the end of the lunch break (Date object)
    for (let i = 4; i < schedule.length; i++) {
        currentDateTime.setMinutes(currentDateTime.getMinutes() + 10); // Add 10 minutes transition
        const talkStartTime = new Date(currentDateTime);
        currentDateTime.setMinutes(currentDateTime.getMinutes() + schedule[i].duration);
        const talkEndTime = new Date(currentDateTime);

        schedule[i].startTime = talkStartTime; // Store as Date object
        schedule[i].endTime = talkEndTime;     // Store as Date object
    }

    // Finally, format all start and end times to strings for display
    return schedule.map(item => ({
        ...item,
        startTime: item.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        endTime: item.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));
}

const fullSchedule = calculateSchedule(talksData);

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Conference Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0056b3;
            text-align: center;
            margin-bottom: 30px;
        }
        .search-container {
            margin-bottom: 20px;
            text-align: center;
        }
        .search-container input[type="text"] {
            width: 70%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .schedule {
            display: grid;
            gap: 20px;
        }
        .talk-card {
            background-color: #e9f5ff;
            border-left: 5px solid #007bff;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s;
        }
        .talk-card.break {
            background-color: #f8d7da;
            border-left-color: #dc3545;
        }
        .talk-card:hover {
            transform: translateY(-3px);
        }
        .talk-card h2 {
            color: #0056b3;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .talk-card .time {
            font-weight: bold;
            color: #666;
            margin-bottom: 5px;
        }
        .talk-card .speakers {
            font-style: italic;
            color: #555;
            margin-bottom: 5px;
        }
        .talk-card .category {
            font-size: 0.9em;
            color: #007bff;
            margin-bottom: 10px;
        }
        .talk-card .category span {
            background-color: #e0f7fa;
            padding: 3px 8px;
            border-radius: 3px;
            margin-right: 5px;
            display: inline-block;
            margin-top: 5px;
        }
        .talk-card p {
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Conference Schedule</h1>
        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., Web, AI, Frontend)">
        </div>
        <div id="schedule" class="schedule">
            <!-- Schedule will be rendered here by JavaScript -->
        </div>
    </div>

    <script>
        const allTalks = ${JSON.stringify(calculateSchedule(talksData), null, 2)};

        function renderSchedule(talksToRender) {
            const scheduleDiv = document.getElementById('schedule');
            scheduleDiv.innerHTML = ''; // Clear previous content

            talksToRender.forEach(talk => {
                const talkCard = document.createElement('div');
                talkCard.classList.add('talk-card');
                if (talk.isBreak) {
                    talkCard.classList.add('break');
                }

                talkCard.innerHTML = \`\
                    <div class="time">\$\{talk.startTime\} - \$\{talk.endTime\}</div>\
                    <h2>\$\{talk.title\}</h2>\
                    \$\{talk.speakers.length > 0 ? \`<div class="speakers">Speakers: \$\{talk.speakers.join(', ')\}\</div>\` : ''\}\
                    \$\{talk.category.length > 0 ? \`<div class="category">Categories: \$\{talk.category.map(cat => \`<span>\$\{cat\}\</span>\`).join('')\}\</div>\` : ''\}\
                    <p>\$\{talk.description\}</p>\
                \`;
                scheduleDiv.appendChild(talkCard);
            });
        }

        function filterTalks() {
            const searchTerm = document.getElementById('categorySearch').value.toLowerCase();
            const filteredTalks = allTalks.filter(talk => {
                if (talk.isBreak) return true; // Always show breaks
                return talk.category.some(cat => cat.toLowerCase().includes(searchTerm));
            });
            renderSchedule(filteredTalks);
        }

        // Initial render
        renderSchedule(allTalks);

        // Event listener for search input
        document.getElementById('categorySearch').addEventListener('keyup', filterTalks);
    </script>
</body>
</html>
`;

fs.writeFileSync('index.html', htmlTemplate, 'utf8');
console.log('index.html generated successfully!');
