const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const getStats = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './stats.json'));
    const stats = JSON.parse(data);
    const playerStats = stats.find(player =>JSON.stringify(player.id) == JSON.stringify(req.params.id));
    if (!playerStats) {
      const err = new Error('Player stats not found');
      err.status = 404;
      throw err;
    }
    res.json(playerStats);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/stats/:id')
  .get(getStats);

  //Get All Method
  const getAllStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(path.join(__dirname, './stats.json'));
      const stats = JSON.parse(data);
      const playerStats = stats.map((player)=>{
        return player;
      });
      if (!playerStats) {
        const err = new Error('Player stats not found');
        err.status = 404;
        throw err;
      }
      res.json(playerStats);
    } catch (e) {
      next(e);
    }
  };
  
  router
    .route('/api/v1/stats')
    .get(getAllStats);

module.exports = router;
// Post Method
const statsFilePath = path.join(__dirname, './stats.json');

const createStats = async (req, res, next) => {
  try {
    const data = fs.readFileSync(statsFilePath);
    const stats = JSON.parse(data);
    const newStats = {
      id: req.body.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      old: req.body.old,
      position:req.body.position,
      wins: req.body.wins,
      losses: req.body.losses,
      points_scored: req.body.points_scored,
    };
    stats.push(newStats);
    fs.writeFileSync(statsFilePath, JSON.stringify(stats));
    res.status(201).json(newStats);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/stats')
  .post(createStats);


  // Put method

  const updateStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.find(player => JSON.stringify(player.id) == JSON.stringify(req.params.id));
      if (!playerStats) {
        const err = new Error('Player stats not found');
        err.status = 404;
        throw err;
      }
      const newStatsData = {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        old: req.body.old,
        position:req.body.position,
        wins: req.body.wins,
        losses: req.body.losses,
        points_scored: req.body.points_scored,
      };
      const newStats = stats.map(player => {
        if (JSON.stringify(player.id) == JSON.stringify(req.params.id)) {
          return newStatsData;
        } else {
          return player;
        }
      });
      fs.writeFileSync(statsFilePath, JSON.stringify(newStats));
      res.status(200).json(newStatsData);
    } catch (e) {
      next(e);
    }
  };

  router
  .route('/api/v1/stats/:id')
  .get(getStats)
  .put(updateStats);

  // Delete Method


  const deleteStats = async (req, res, next) => {
    try {
      const data = fs.readFileSync(statsFilePath);
      const stats = JSON.parse(data);
      const playerStats = stats.find(player => JSON.stringify(player.id) == JSON.stringify(req.params.id));
      if (!playerStats) {
        const err = new Error('Player stats not found');
        err.status = 404;
        throw err;
      }
      const newStats = stats.map(player => {
        if (JSON.stringify(player.id) == JSON.stringify(req.params.id)) {
          return null;
        } else {
          return player;
        }
      })
      .filter(player => player !== null);
      fs.writeFileSync(statsFilePath, JSON.stringify(newStats));
      res.status(200).end();
    } catch (e) {
      next(e);
    }
  };
  router
  .route('/api/v1/stats/:id')
  .get(getStats)
  .put(updateStats)
  .delete(deleteStats);

