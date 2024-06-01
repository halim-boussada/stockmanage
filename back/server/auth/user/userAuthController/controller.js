const UserService = require("../../../service/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async getUsers(req, res, next) {
    try {
      const users = await UserService.getAllUser();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  async getUserById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  async delet(req, res, next) {
    try {
      var Users = await UserService.delete(req.params.id);
      res.send({ msg: "deleted" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async update(req, res, next) {
    try {
      var Users = await UserService.update(req.params.id, req.body);
      var getUpdatedUser = await UserService.getUserById(req.params.id);
      res.send({ msg: "updated", getUpdatedUser });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async signUpUser(req, res) {
    try {
      // res.send(req.body);
      if (!req.body.password || !req.body.username) {
        res.send({ msg: false });
      }
      const user = await UserService.getUserbyEmail(req.body.email);
      if (user) {
        res.send({ msg: "email already exist" });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          var User = req.body;
          User.password = hash;
          var newUser = await UserService.signup(User);
          var token = jwt.sign({ id: newUser._id }, "sa7fa leblebi");
          var accessToken = jwt.sign({ id: newUser._id }, "halelews");
          res.send({
            msg: true,
            token,
            access_token: accessToken,
            user: newUser,
          });
        });
      }
    } catch {
      res.send("get error ");
    }
  },
  async login(req, res) {
    try {
      var User;
      User = await UserService.getUserbyEmail(req.body.email);

      const user = User;

      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            var token = jwt.sign({ id: user._id }, "sa7fa leblebi");
            var access_token = jwt.sign({ id: user._id }, "halelews");
            res.send({ token, access_token, user });
          } else {
            res.send({ msg: "wrong password" });
          }
        });
      } else {
        res.send({ msg: "wrong Email" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.send("Error during login");
    }
  },

  async verify(req, res) {
    try {
      if (!req.body.token) {
        res.send({ msg: false });
      }
      var objId = jwt.verify(req.body.token, "sa7fa leblebi");
      var User = await UserService.getUserById(objId.id);
      if (User) {
        res.send(User);
      } else {
        res.send({ msg: false });
      }
    } catch {
      res.send("get error ");
    }
  },
};
