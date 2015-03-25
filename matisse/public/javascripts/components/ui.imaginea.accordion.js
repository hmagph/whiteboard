/**
 * Author: Bahvani Shankar
 * Date: 12/26/11
 * Time: 11:16 AM
 * About matisse.ui : matisse.ui is the module to set lall ui related things like canvas, accordian, carousal etc.
 */
define(["matisse.ui"],function (ui) {
	"use strict";
	/*
		Custom Accordion Implementation for Matisee.
			1. Multiple Sections can be opened.
			2. Atleast one section should be opened at a single poing of time.
			3. Click on the header section to close the section	
		Expection json properties Obj
		{
			"cntrId":"",  //Id of the Accordion Headers and Sections
			"headerClass":"p-header",  //css class of the accordion header
			"sectionClass":"p-cntr",  //css class of the accordion section
			"headerOpenClass":"open",  //css class of the accordion header open
			"headerCloseClass":"close" //css class of the accordion header close				
		}
	*/
	function CustomAccordion(jsonPropObj){
		//copy all the jsonPropObj to default Obj;
		//Validate the obj for minimum properties, if some thing is wrong, throw a alert.
		this.props = jsonPropObj;	
		this.cntrObj = $("#"+this.props.cntrId);
		this.initalizeAccordion();
		this.showFirstSection();
	};

	CustomAccordion.prototype = {
		/**
		* Inialize the Accordion, add event handlers to the header eles.
		* open the first section
		*
		*/
		initalizeAccordion:function(){
			var headerEles = $(this.cntrObj).find("."+this.props.headerClass),
			selfObj = this,
			targetEle;
			//Add Event handlers to the header elements		
			$(headerEles).bind("click",function(e){
				targetEle = e.currentTarget;				
				ui.resetShapeSelection();				
				if($(targetEle).hasClass(selfObj.props.headerCloseClass)){
					selfObj.showSection(targetEle);
				}else{
					selfObj.closeSection(targetEle);
//Logic to make atleast one section visible at the given point of time					
/*					var openedSectionEles =  $(selfObj.cntrObj).find("."+ selfObj.props.sectionClass		+":visible")						

					if(openedSectionEles.length==1){
						return
					}else{	
						selfObj.closeSection(targetEle);											
					}	*/
				}
	
			});
			selfObj.cntrObj.mCustomScrollbar({scrollInertia:0});
		},
		/*
		* Show the first Section
		*
		*/
		showFirstSection:function(){
			var firstHeaderEle = $(this.cntrObj).find("."+this.props.headerClass+":last");	
			this.showSection(firstHeaderEle);
		},
		/*
		* Shows the section, changes the header class to change the icon
		*
		*/
		showSection:function(headerEle){
			//Changeing the icon of header
			$(headerEle).removeClass(this.props.headerCloseClass).addClass(this.props.headerOpenClass);				

			//openSection
			$(headerEle).next().show();		
			$("#accordion").mCustomScrollbar("update");
		},
		/*
		* Closes the section, changes the header class to change the icon
		*
		*/
		closeSection:function(headerEle){
			//Changeing the icon of header
			$(headerEle).addClass(this.props.headerCloseClass).removeClass(this.props.headerOpenClass);		

			//closeSection
			$(headerEle).next().hide();	
			$("#accordion").mCustomScrollbar("update");
		}
	}	
	return CustomAccordion;
});
