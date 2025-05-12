const express = require('express')
const router = express.Router()

const {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
} = require('../controllers/jobs')

router.get('/', getAllJobs)
router.post('/', createJob)
router.get('/:id', getJob )
router.delete('/:id', deleteJob )
router.patch('/:id', updateJob)


module.exports = router