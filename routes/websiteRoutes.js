// const express = require('express');
// const { Country, State, City } = require('country-state-city');

// const {
//   getAllRolePages,
//   getFeaturedJobseekers,
//   getFeaturedBlogs,
// } = require('../controller/websiteController');

// const router = express.Router();

// // Existing routes
// router.get('/get-all-role-pages', getAllRolePages);
// router.get('/jobseekers/featured', getFeaturedJobseekers);
// router.get('/fetured-blogs', getFeaturedBlogs);


// // =============================
// // COUNTRY SEARCH
// // =============================
// router.get('/get-countries', (req, res) => {
//   try {
//     const search = (req.query.q || '').toLowerCase().trim();

//     let countries = Country.getAllCountries();

//     if (search) {
//       countries = countries.filter(country =>
//         country.name.toLowerCase().includes(search)
//       );
//     }

//     const data = countries.slice(0, 20).map(country => ({
//       name: country.name,
//       isoCode: country.isoCode,
//       phonecode: country.phonecode,
//       flag: country.flag,
//     }));

//     return res.status(200).json({
//       data,
//     });
//   } catch (error) {
//     console.error('GET COUNTRIES ERROR:', error);

//     return res.status(500).json({
//       message: 'Failed to fetch countries',
//     });
//   }
// });


// // =============================
// // STATE SEARCH
// // =============================
// router.get('/get-states', (req, res) => {
//   try {
//     const search = (req.query.q || '').toLowerCase().trim();
//     const countryCode = req.query.countryCode;

//     let states = countryCode
//       ? State.getStatesOfCountry(countryCode)
//       : State.getAllStates();

//     if (search) {
//       states = states.filter(state =>
//         state.name.toLowerCase().includes(search)
//       );
//     }

//     const data = states.slice(0, 30).map(state => ({
//       name: state.name,
//       isoCode: state.isoCode,
//       countryCode: state.countryCode,
//     }));

//     return res.status(200).json({
//       data,
//     });
//   } catch (error) {
//     console.error('GET STATES ERROR:', error);

//     return res.status(500).json({
//       message: 'Failed to fetch states',
//     });
//   }
// });


// // =============================
// // CITY SEARCH
// // =============================
// router.get('/get-cities', (req, res) => {
//   try {
//     const search = (req.query.q || '').toLowerCase().trim();
//     const countryCode = req.query.countryCode;
//     const stateCode = req.query.stateCode;

//     let cities;

//     if (countryCode && stateCode) {
//       cities = City.getCitiesOfState(countryCode, stateCode);
//     } else if (countryCode) {
//       cities = City.getCitiesOfCountry(countryCode);
//     } else {
//       cities = City.getAllCities();
//     }

//     if (search) {
//       cities = cities.filter(city =>
//         city.name.toLowerCase().includes(search)
//       );
//     }

//     const data = cities.slice(0, 30).map(city => ({
//       name: city.name,
//       countryCode: city.countryCode,
//       stateCode: city.stateCode,
//     }));

//     return res.status(200).json({
//       data,
//     });
//   } catch (error) {
//     console.error('GET CITIES ERROR:', error);

//     return res.status(500).json({
//       message: 'Failed to fetch cities',
//     });
//   }
// });

// module.exports = router;
















const express = require('express');

const {
  Country,
  State,
  City,
} = require('country-state-city');

const {
  getAllRolePages,
  getFeaturedJobseekers,
  getFeaturedBlogs,
} = require('../controller/websiteController');

const {
  getDesignations,
  getUniversities,
  getDegrees,
  getLanguages,
  getSkills,
} = require('../controller/masterDataController');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const normalizeSearch = value => {
  return String(value || '')
    .trim()
    .toLowerCase();
};

const normalizeLimit = (
  value,
  defaultValue = 30,
  maxValue = 100,
) => {
  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    return defaultValue;
  }

  return Math.min(
    Math.floor(parsed),
    maxValue,
  );
};

/*
|--------------------------------------------------------------------------
| EXISTING WEBSITE ROUTES
|--------------------------------------------------------------------------
*/

router.get(
  '/get-all-role-pages',
  getAllRolePages,
);

router.get(
  '/jobseekers/featured',
  getFeaturedJobseekers,
);

router.get(
  '/fetured-blogs',
  getFeaturedBlogs,
);

/*
|--------------------------------------------------------------------------
| COUNTRY SEARCH
|--------------------------------------------------------------------------
*/

router.get('/get-countries', (req, res) => {
  try {
    const search =
      normalizeSearch(req.query.q);

    const limit =
      normalizeLimit(req.query.limit, 30);

    let countries =
      Country.getAllCountries();

    if (search) {
      countries =
        countries.filter(country =>
          country.name
            .toLowerCase()
            .includes(search),
        );
    }

    const data = countries
      .slice(0, limit)
      .map(country => ({
        name: country.name,
        isoCode: country.isoCode,
        phonecode:
          country.phonecode,
        flag: country.flag,
        currency:
          country.currency,
        latitude:
          country.latitude,
        longitude:
          country.longitude,
      }));

    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error(
      'GET COUNTRIES ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch countries',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
});

/*
|--------------------------------------------------------------------------
| STATE SEARCH
|--------------------------------------------------------------------------
*/

router.get('/get-states', (req, res) => {
  try {
    const search =
      normalizeSearch(req.query.q);

    const countryCode = String(
      req.query.countryCode || '',
    )
      .trim()
      .toUpperCase();

    const limit =
      normalizeLimit(req.query.limit, 50);

    let states;

    if (countryCode) {
      states =
        State.getStatesOfCountry(
          countryCode,
        );
    } else {
      states =
        State.getAllStates();
    }

    if (search) {
      states =
        states.filter(state =>
          state.name
            .toLowerCase()
            .includes(search),
        );
    }

    const data = states
      .slice(0, limit)
      .map(state => ({
        name: state.name,
        isoCode:
          state.isoCode,
        countryCode:
          state.countryCode,
        latitude:
          state.latitude,
        longitude:
          state.longitude,
      }));

    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error(
      'GET STATES ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch states',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CITY SEARCH
|--------------------------------------------------------------------------
*/

router.get('/get-cities', (req, res) => {
  try {
    const search =
      normalizeSearch(req.query.q);

    const countryCode = String(
      req.query.countryCode || '',
    )
      .trim()
      .toUpperCase();

    const stateCode = String(
      req.query.stateCode || '',
    )
      .trim()
      .toUpperCase();

    const limit =
      normalizeLimit(req.query.limit, 50);

    let cities = [];

    if (
      countryCode &&
      stateCode
    ) {
      cities =
        City.getCitiesOfState(
          countryCode,
          stateCode,
        );
    } else if (
      countryCode
    ) {
      cities =
        City.getCitiesOfCountry(
          countryCode,
        );
    } else {
      cities =
        City.getAllCities();
    }

    if (search) {
      cities =
        cities.filter(city =>
          city.name
            .toLowerCase()
            .includes(search),
        );
    }

    const data = cities
      .slice(0, limit)
      .map(city => ({
        name: city.name,
        countryCode:
          city.countryCode,
        stateCode:
          city.stateCode,
        latitude:
          city.latitude,
        longitude:
          city.longitude,
      }));

    return res.status(200).json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error(
      'GET CITIES ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch cities',
      error:
        process.env.NODE_ENV ===
        'development'
          ? error.message
          : undefined,
    });
  }
});

/*
|--------------------------------------------------------------------------
| MASTER DATA
|--------------------------------------------------------------------------
*/

router.get(
  '/get-designations',
  getDesignations,
);

router.get(
  '/get-universities',
  getUniversities,
);

router.get(
  '/get-degrees',
  getDegrees,
);

router.get(
  '/get-languages',
  getLanguages,
);

router.get(
  '/get-skills',
  getSkills,
);

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

router.get(
  '/website-health',
  (req, res) => {
    return res.status(200).json({
      success: true,
      service: 'website-api',
      timestamp:
        new Date().toISOString(),
    });
  },
);

module.exports = router;