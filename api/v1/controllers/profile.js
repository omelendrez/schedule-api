"use strict";
const Profile = require("../models").profile;

var new_profile_number = 0;
module.exports = {

  create(req, res) {
    Profile.max("profile_number").then(max => {
      new_profile_number = ("0".repeat(5) + (Number(max) + 1).toString()).slice(-5);
    });
    let total_profile = 0;
    let items = 0;
    Basket
      .findAll()
      .then(basket => {
        basket.forEach((item) => {
          const record = item.get({
            plain: true
          });
          Profile
            .create({
              profile_number: new_profile_number,
              product_id: record.product_id,
              quantity: record.quantity,
              unit_price: record.unit_price,
              total_price: record.total_price,
              discount: record.discount,
              net_price: record.net_price
            });
          total_profile = total_profile + parseFloat(record.net_price);
          items++;
        }); // End forEach
      })
      .then(() => {
        Basket.destroy({
          where: {},
          truncate: true
        });
        res.json(201, {
          profile_number: new_profile_number,
          total_profile: total_profile,
          items: items
        });
      })
      .catch(error => res.status(400).json(error));

  },

  findAll(req, res) {
    return Profile
      .findAll({
        raw: true
      })
      .then(profiles => res.json(200, profiles))
      .catch(error => res.status(400).send(error));
  },

  findById(req, res) {
    return Profile
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(profile => profile ? res.json(200, profile) : res.status(404).json({
        error: "Not found"
      }))
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return Profile
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(profile => profile.destroy()
        .then(result => {
          res.json(result);
        }))
      .catch(error => res.status(400).send(error));
  }

};