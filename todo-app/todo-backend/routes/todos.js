const express = require('express');
const redis = require('../redis')
const { Todo } = require('../mongo')
const router = express.Router();

const add_todo = async function () {
  const todos = await redis.getAsync('added_todos');
  console.log(todos)
  if (todos) {
    await redis.setAsync('added_todos', parseInt(todos) + 1)
  } else {
    await redis.setAsync('added_todos', 1)
  }
}

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
  add_todo();
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { text, done } = req.body
  console.log(req.body)
  const todo = await Todo.findByIdAndUpdate(req.todo._id, {
    text,
    done
  }, { new: true })
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
