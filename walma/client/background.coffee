Backbone = require "backbone"
_  = require 'underscore'

background = NS "PWB.background"
views = NS "PWB.drawers.views"




class views.BackgroundSelect extends Backbone.View

  events:
    "tap .backgroundDelete": "deleteBackground"
    "tap .backgroundResize": "resizeBackground"
    "change input": "setBackgroundFromEvent"

  constructor: ({ @area, @background, @notifications }) ->
    super

    source = $("script.backgroundSelectTemplate").html()
    @template = Handlebars.compile source

    @bindDragAndDrop()

    @model.bind "change:bigBackground", => @render()
    @model.bind "change:background", => @render()


  deleteBackground: ->
    @model.deleteBackground()
    @render()

  resizeBackground: ->
    @area.resizeBackgroundToThreshold()
    @render()

  setBackgroundFromEvent: (e) ->
    @readFileToModel e.target.files[0]


  readFileToModel: (file) ->
    @model.saveBackground file, =>
      @render()
      @notifications.info "Background saved"



  render: ->
    $(@el).html @template

    if not @model.get "background"
      @$(".delete").remove()

    if not @model.get "bigBackground"
      @$(".resize").remove()


  bindDragAndDrop: ->

    $(document).bind "dragenter", (e) ->
      e.preventDefault()
      e.originalEvent.dataTransfer.dropEffect = 'copy'

    $(document).bind "dragover", (e) ->
      e.preventDefault()
      e.originalEvent.dataTransfer.dropEffect = 'copy'

    $(document).bind "dragleave", (e) -> e.preventDefault()
    $(document).bind "dragend", (e) -> e.preventDefault()
    $(document).bind "drop", (e) =>
      e.preventDefault()
      @readFileToModel e.originalEvent.dataTransfer.files[0]

