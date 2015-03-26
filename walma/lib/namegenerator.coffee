
{Drawing} = require "../lib/drawmodel"

###
Generates new unique name with a prefix that won't clash with existing room
names.
###
generateUniqueName = (prefix, modifier, cb=->) ->
  if not cb
    cb = modifier
    modifier = (s) -> s


  Drawing.db.collection "whiteboard-config", (err, collection) ->
    throw err if err
    update =
      $inc: {}

    fieldName = prefix + "Count"
    update.$inc[fieldName] = 1

    collection.findAndModify
      _id: "config"
    , [['_id','asc']]
    , update
    , new: true
    , (err, doc) ->
      return cb new Error "config doc is missing" unless doc
      newName = modifier prefix, doc[fieldName]
      # Make sure that the new name does not clash with existing
      Drawing.collection.find(name: newName).nextObject (err, doc) ->
        if doc
          console.log "Retrying"
          generateUniqueName prefix, modifier, cb
        else
          cb err, newName


module.exports = generateUniqueName
