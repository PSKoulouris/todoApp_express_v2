const express = require('express')
const uuid = require('uuid')

const taskUtils = require('../util/tasks.utils')

const router = express.Router()

//r => r.rId === restaurantId
/*function restaurantSelector(r){
    return r.rId === restaurantId
}*/

function taskSelector(restaurantId) {
    return function(r) {
        return r.rId === restaurantId;
    };
}


router.get('/tasks/:rid',function(req,res){
    // To send back the right restaurant details!
    const taskId = req.params.rid
    //console.log(restaurantId)

    const tasks = taskUtils.getTasks()

    for(const task of tasks){
        if(taskId === task.rId){
           return res.render('task-details',{task}) 
        }
    }
})

router.get('/addtask',function(req,res){
    res.render('addtask')
})


router.post('/addtask', function(req,res){
    const task = req.body;
    task.rId = uuid.v4();

    const duedate = task.duedate;
    //console.log(duedate)
    let duedateModified = new Date(duedate); // duedateModified is a Date object

    // Use duedateModified instead of duedate
    const humanReadableDate = duedateModified.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    
    task.duedate = humanReadableDate;
    const tasks = taskUtils.getTasks();
    
    tasks.push(task);
    taskUtils.storeTasks(tasks);

    res.redirect('confirm');
});

router.get('/confirm',function(req,res){
    res.render('confirm')
})

router.get('/tasks/:rid/edit',function(req,res){
    //Retrieve the id of the restaurant to be edited
    const taskId = req.params.rid
    
    //Retrieve all the restaurants
    const tasks = taskUtils.getTasks()

    //Find the restaurant Index
    const task = tasks.find( t => t.rId === taskId)

    if(!task){
        return res.status(404).render('404')
    }

    res.status(200).render('edit-task',{task})
})


router.post('/tasks/:rid/edit',function(req,res){
    //Retrieve the element(restaurant) id
    const taskId = req.params.rid
    const updatedData = req.body

    const tasks = taskUtils.getTasks()

    //Find the restaurant index
    const taskIndex = tasks.findIndex(taskSelector(taskId)) //Time complexity goes high, approach not encouraged!
    
    if(taskIndex === -1){
        return res.status(404).render('404')
    }

    //update the restaurant details in the variable 
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updatedData
    }

    taskUtils.storeTasks(tasks)

    res.redirect('/tasks')

})

router.get('/tasks/:rid/delete', function(req,res){
    const taskId = req.params.rid

    const tasks = taskUtils.getTasks()

    const filteredTasks = tasks.filter(t => t.rId !== taskId)

    taskUtils.storeTasks(filteredTasks)

    res.redirect('/tasks')
})


// SORT TASKS:
router.get('/tasks',function(req,res){
    let currentOrder = req.query.order
    let nextOrder = "desc"

    if(currentOrder != "asc" && currentOrder != "desc"){
        currentOrder = "asc"
    }
    if(currentOrder == "desc"){
        nextOrder = "asc"
    }
    //retrieve the tasks:
    const tasks = taskUtils.getTasks()
    tasks.sort(function(taskA,taskB){
        if(
            (currentOrder === "asc" && taskA.title.toLowerCase() > taskB.title.toLowerCase()) ||(currentOrder === "desc" && taskB.title.toLowerCase() > taskA.title.toLowerCase())
        ){
            return 1
        }
        return -1
    })
    console.log("gello")
    console.log(nextOrder)
    res.render("tasks", {
        storedTasks: tasks,    
        numberOfTasks: tasks.length,
        nextOrder: nextOrder
    });
})


module.exports = router