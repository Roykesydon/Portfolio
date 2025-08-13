export const introductionData = {
    education: [
        {
            degree: "MSc, Computer Science and Information Engineering",
            school: "National Cheng Kung University",
            year: "2023-2025"
        },
        {
            degree: "BSc, Computer Science and Engineering",
            school: "National Taiwan Ocean University",
            year: "2019-2023"
        }
    ],
    awards: [
        {
            title: "Silver Medal",
            event: "The 2020 ICPC Asia Taipei-Hsinchu Site Programming Contest",
            ranking: "13/101",
            year: "2020/11"
        },
        {
            title: "1st Place",
            event: "2024 TSMC IT CareerHack (廠務知識機器人)",
            ranking: null,
            year: "2024/01"
        },
        {
            title: "Solved: 7/7 problems",
            event: "Collegiate Programming Examination (CPE)",
            ranking: "2/2459",
            year: "2021/12"
        },
        {
            title: "4th Place",
            event: "2021 National Collegiate Programming Contest (NCPC)",
            ranking: null,
            year: "2021/10"
        },
        {
            title: "3rd Place",
            event: "2020 Central Collegiate Programming Contest (CCPC)",
            ranking: null,
            year: "2020/12"
        },
        {
            title: "2nd Place",
            event: "2021 National Dong Hwa University Programming Contest",
            ranking: null,
            year: "2021/12"
        }
    ],
    skills: {
        Language: ["C++", "Python", "Javascript", "Java", "SQL"],
        Framework: ["Vue", "Pytorch", "Flask", "FastAPI", "Express.js", "Spring Boot"],
        Database: ["MariaDB", "MongoDB", "Redis", "PostgreSQL"],
        Others: ["Git", "Docker", "Node.js", "Kubernetes", "Nginx", "Azure DevOps"]
    },
    experience: [
        {
            role: "DevOps Engineer Intern",
            company: "Taiwan Semiconductor Manufacturing Company",
            duration: "2024"
        },
        {
            role: "Linux Server Administrator",
            company: "National Cheng Kung University - Ubiquitous Sensing and Cloud Computing Lab",
            duration: "2023-2025"
        },
        {
            role: "Adjunct Research Assistant",
            company: "Advanced Computation Laboratory",
            duration: "2020-2023"
        }
    ],
    workingExperience: [
        {
            job: "Web File Browser System",
            details: "Developed a tool for browsing files within specified containers in Kubernetes. The system allows users to navigate directories within a container, view text file contents, and download files. File downloads are implemented using streaming, eliminating the need to first download the entire file on the backend before transmitting it to the frontend. The frontend was built using React, while the backend was developed with Spring Boot, employing Mockito for creating mocks and stubs. The entire project was developed using Scrum methodology, with Azure DevOps used for project management and support.",
            duration: "2024"
        },
        {
            job: "Linux Server Management",
            details: "Responsible for managing Linux servers equipped with public GPUs for the laboratory. Duties included creating and managing user accounts, addressing each user’s specific environment requirements, and utilizing Docker to set up containers. Ensured users could access their dedicated containers using their existing SSH private keys and install necessary libraries. Additionally, used LVM to dynamically expand disk space to accommodate the increasing storage demands as the number of laboratory members grew.",
            duration: "2023-2025"
        },
        {
            job: "Real-time Fishing Vessel Detection at the Fishing Port",
            details: "Multiple cameras are installed at the fishing port to obtain the camera images through RTSP and achieve the automated counting of fishing vessels at the port. The backend integrates YOLOv4, FastAPI, and some image processing techniques to recognize the received camera images. The frontend uses Vue as framework to provide detection results and harbor data for the past 48 hours.",
            duration: "2022"
        }
    ]
}