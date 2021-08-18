"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ItemModel = require("../models/mongoose/Item");

var ItemService =
/*#__PURE__*/
function () {
  function ItemService() {
    _classCallCheck(this, ItemService);
  }

  _createClass(ItemService, null, [{
    key: "getAll",
    value: function getAll() {
      return regeneratorRuntime.async(function getAll$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", ItemModel.find({}).sort({
                createdAt: -1
              }).exec());

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "getOne",
    value: function getOne(itemId) {
      return regeneratorRuntime.async(function getOne$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", ItemModel.findById(itemId).exec());

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "create",
    value: function create(data) {
      var item;
      return regeneratorRuntime.async(function create$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              item = new ItemModel(data);
              return _context3.abrupt("return", item.save());

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "update",
    value: function update(itemId, data) {
      return regeneratorRuntime.async(function update$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt("return", ItemModel.findByIdAndUpdate(itemId, data).exec());

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "remove",
    value: function remove(itemId) {
      return regeneratorRuntime.async(function remove$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", ItemModel.deleteOne({
                _id: itemId
              }).exec());

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }]);

  return ItemService;
}();

module.exports = ItemService;