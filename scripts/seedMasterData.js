require('dotenv').config();

const mongoose = require('mongoose');

const {
  MasterData,
} = require('../models/masterDataModel');

const masterData = {
  designation: [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'UI/UX Designer',
    'Product Designer',
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Engineer',
    'DevOps Engineer',
    'Cloud Engineer',
    'QA Engineer',
    'Automation Test Engineer',
    'Technical Lead',
    'Team Lead',
    'Engineering Manager',
    'Solution Architect',
    'System Administrator',
    'Database Administrator',
    'Cyber Security Engineer',
  ],

  degree: [
    'B.Tech',
    'B.E',
    'BCA',
    'B.Sc',
    'B.Com',
    'BBA',
    'BA',
    'M.Tech',
    'M.E',
    'MCA',
    'M.Sc',
    'M.Com',
    'MBA',
    'MA',
    'PhD',
    'Diploma',
  ],

  language: [
    'English',
    'Hindi',
    'Kannada',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Marathi',
    'Bengali',
    'Gujarati',
    'Punjabi',
    'Urdu',
    'Odia',
    'Assamese',
    'Arabic',
    'French',
    'German',
    'Spanish',
  ],

  skill: [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'Python',
    'Java',
    'C',
    'C++',
    'C#',
    'PHP',
    'Laravel',
    'Django',
    'FastAPI',
    'AWS',
    'Azure',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'Git',
    'GitHub',
    'Redis',
    'GraphQL',
  ],

  university: [
    'Bangalore University',
    'Visvesvaraya Technological University',
    'University of Delhi',
    'University of Mumbai',
    'Anna University',
    'University of Calcutta',
    'Savitribai Phule Pune University',
    'Osmania University',
    'University of Madras',
    'Manipal Academy of Higher Education',
    'Amity University',
    'Christ University',
  ],
};

async function seed() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        'MongoDB URI not found in environment',
      );
    }

    await mongoose.connect(
      mongoUri,
    );

    console.log(
      'MongoDB connected',
    );

    for (
      const [
        type,
        values,
      ] of Object.entries(masterData)
    ) {
      for (
        let index = 0;
        index < values.length;
        index++
      ) {
        const name =
          values[index];

        await MasterData.updateOne(
          {
            type,
            normalizedName:
              name
                .trim()
                .toLowerCase(),
          },
          {
            $set: {
              name,
              normalizedName:
                name
                  .trim()
                  .toLowerCase(),
              isActive: true,
              sortOrder: index,
            },
          },
          {
            upsert: true,
          },
        );
      }

      console.log(
        `${type}: ${values.length} records seeded`,
      );
    }

    console.log(
      'Master data seed completed',
    );

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      'MASTER DATA SEED ERROR:',
      error,
    );

    await mongoose
      .disconnect()
      .catch(() => {});

    process.exit(1);
  }
}

seed();