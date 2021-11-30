const router = require("express").Router();
const Notes = require("../models/Notes");


router.post("/",async(req,res)=>{
  const {branch, semester, noteType} = req.body;
  const foundNotes = await Notes.find({branch, semester, noteType});
  res.json({
    message: foundNotes.length > 0 ? `Here are your ${noteType} from ${branch} branch ${semester} semester.` : `No ${noteType} found!`,
    notes: foundNotes.map(note => ({
      subject: note.subject,
      profName: note.profName,
      url: note.notesLoc
    }))
  })
})

module.exports = router;