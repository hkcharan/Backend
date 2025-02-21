import mongoose from "mongoose"

const SettingSchema = new mongoose.Schema({
    category : { 
        type: [String], 
        default: [] 
    },

    showOnline:{
        type:Boolean,
        default: false,
    },

    profileColor:{
        type:Boolean,
        default: false,
    },

    showMusic:{
        type:Boolean,
        default: true,
    },

    showColorSwitcher:{
        type:Boolean,
        default: true,
    },

    showDarkMode:{
        type:Boolean,
        default: true,
    },

    showSetting:{
        type:Boolean,
        default: true,
    },

    showAboutImageMobile:{
        type:Boolean,
        default: true,
    },

    showAboutImageLarger:{
        type:Boolean,
        default: false,
    },

    showFooter:{
        type:Boolean,
        default: true,
    },

    showNavbar:{
        type:Boolean,
        default: true,
    },

    footer:{
        type:String,
    },

})

export const Setting = mongoose.model("Setting", SettingSchema)