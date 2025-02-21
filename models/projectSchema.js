import mongoose from "mongoose";

const projectSchema = new  mongoose.Schema({
        name: {
            type: String,
        },
        technologies: {
            type: [String],  
        },
        githubLink: {
            type: String,
        },
        liveLink: {
            type: String,
        },
        description: {
            type: String,
        },
        details: {
            type: String,
        },
        category: {
            type: String,
        },
        pinned: {
            type: Boolean,
            default: false
        },
        hosted: {
            type: Boolean,
            default: false
        },
        sourceCode:{
            type:Boolean,
            default:false,
        },
        screenshots: {
            type: [String],
            required: false
        }
    }, {
        timestamps: true 
    });
    
export const Project = mongoose.model('Project', projectSchema);
