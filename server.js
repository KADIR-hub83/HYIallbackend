require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const UserRoutes = require('./routes/jobseekerRoutes');
const CompanyRoutes = require('./routes/companyRoutes');
const AuthRouths = require('./routes/authRoutes');
const ProjectRouths = require('./routes/projectRouts');
const swaggerOptions = require('./utils/swagger/swagger');
const contactForm = require('./routes/contactFormRoutes');
const careerForm = require('./routes/careerRoutes');
const mockTest = require('./routes/testRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const auditLoggerMiddleware = require('./middleware/auditLoggerMiddleware');
const cors = require('cors');

//express app
const app = express();
app.use(
  cors({
    origin: '*',
  }),
);
// Serve API docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
//middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
//audit logging middleware
app.use(auditLoggerMiddleware); // Use the middleware here
//routs
app.use('/api', UserRoutes);
app.use('/api', CompanyRoutes);
app.use('/api', AuthRouths);
app.use('/api', ProjectRouths);
app.use('/api', contactForm);
app.use('/api', careerForm);
app.use('/api', mockTest);
app.use('/api', websiteRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  
    // listen for request
    app.listen(process.env.PORT, () => {
      console.log('connecting the db and listening on port ', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

process.env;
