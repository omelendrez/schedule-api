"use strict";
const Budget = require("../models").budget;

module.exports = {

  create(req, res) {
    let product_id = req.body.product_id;
    let quantity = req.body.quantity;
    let unit_price = 0;
    let discount_id = 0;
    let percent = 0;

    Product
      .findOne({
        where: {
          id: product_id
        },
        attributes: ['price']
      }).then(result => {
        unit_price = result.get({
          plain: true
        }).price;

        ProductDiscount
          .findOne({
            where: {
              product_id: product_id
            },
            attributes: ['discount_id']
          }).then(result => {
            if (result) {
              discount_id = result.get({
                plain: true
              }).discount_id;
              discount_id = discount_id ? discount_id : 0;
            } else {
              discount_id = 0;
            }

            Discount
              .findOne({
                where: {
                  id: discount_id
                },
                attributes: ['percent']
              }).then(result => {
                if (result) {
                  percent = result.get({
                    plain: true
                  }).percent;
                  percent = percent ? percent : 0;
                } else {
                  percent = 0;
                }

                let total_price = unit_price * quantity;
                let discount = total_price * percent / 100;
                let net_price = total_price - discount;

                Budget
                  .create({
                    product_id: product_id,
                    quantity: quantity,
                    unit_price: unit_price,
                    total_price: total_price,
                    discount: discount,
                    net_price: net_price
                  })
                  .then(budget => res.status(201).json(budget))
                  .catch(error => res.status(400).json(error));
              });
          });
      })
  },

  findAll(req, res) {
    return Budget
      .findAll({
        raw: true
      })
      .then(budget => res.json(budget))
      .catch(error => res.status(400).send(error));
  }
};