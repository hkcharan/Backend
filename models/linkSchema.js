import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  instagram: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  whatsapp: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  github: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  twitter: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  linkedin: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  snapchat: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  facebook: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  discord: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  leetcode: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  portfolio: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  telegram: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
  extra: {
    url: { type: String, required: false },
    showInPortfolio: { type: Boolean, default: false },
  },
});

export const Link = mongoose.model('Link', LinkSchema);
