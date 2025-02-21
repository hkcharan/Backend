import { Link } from "../models/linkSchema.js";

// Controller to handle creation of a new social media entry
export const createLink = async (req, res) => {
  const { instagram, whatsapp, github, twitter, linkedin, snapchat, facebook, discord, telegram,leetcode, portfolio , extra} = req.body;

  try {
    // Create a new social media entry
    const newLink = new Link({
      instagram: {
        url: instagram?.url || '',
        showInPortfolio: instagram?.showInPortfolio ?? false,
      },
      whatsapp: {
        url: whatsapp?.url || '',
        showInPortfolio: whatsapp?.showInPortfolio ?? false,
      },
      github: {
        url: github?.url || '',
        showInPortfolio: github?.showInPortfolio ?? false,
      },
      twitter: {
        url: twitter?.url || '',
        showInPortfolio: twitter?.showInPortfolio ?? false,
      },
      linkedin: {
        url: linkedin?.url || '',
        showInPortfolio: linkedin?.showInPortfolio ?? false,
      },
      snapchat: {
        url: snapchat?.url || '',
        showInPortfolio: snapchat?.showInPortfolio ?? false,
      },
      facebook: {
        url: facebook?.url || '',
        showInPortfolio: facebook?.showInPortfolio ?? false,
      },
      discord: {
        url: discord?.url || '',
        showInPortfolio: discord?.showInPortfolio ?? false,
      },
      telegram: {
        url: telegram?.url || '',
        showInPortfolio: telegram?.showInPortfolio ?? false,
      },
      leetcode: {
        url: leetcode?.url || '',
        showInPortfolio: leetcode?.showInPortfolio ?? false,
      },
      portfolio: {
        url: portfolio?.url || '',
        showInPortfolio: portfolio?.showInPortfolio ?? false,
      },
      extra: {
        url: extra?.url || '',
        showInPortfolio: extra?.showInPortfolio ?? false,
      },
    });

    // Save the new entry to the database
    const savedLink = await newLink.save();

    // Respond with the saved document
    res.status(201).json(savedLink);
  } catch (err) {
    res.status(500).json({ message: 'Error creating link entry', error: err.message });
  }
};


export const getLinks = async (req, res) => {
    try {
      const links = await Link.find();
  
      if (!links.length) {
        return res.status(400).json({ message: "No Links Found" });
      }
  
      res
        .status(200)
        .json({ message: "Links Are Retrieved Successfully", data:links });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Internal Server Error" });
    }
  };


  // Controller to handle updating a social media entry by ID
export const updateLink = async (req, res) => {
  const { id } = req.params;
  const {
    instagram,
    whatsapp,
    github,
    twitter,
    linkedin,
    snapchat,
    facebook,
    discord,
    telegram,
    leetcode,
    portfolio,
    extra
  } = req.body;

  try {
    // Find the document by ID and update it with the new data
    const updatedLink = await Link.findByIdAndUpdate(
      id,
      {
        instagram: { ...instagram },
        whatsapp: { ...whatsapp },
        github: { ...github },
        twitter: { ...twitter },
        linkedin: { ...linkedin },
        snapchat: { ...snapchat },
        facebook: { ...facebook },
        discord: { ...discord },
        telegram:{...telegram},
        leetcode: { ...leetcode },
        portfolio: { ...portfolio },
        extra: { ...extra }
      },
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedLink) {
      return res.status(404).json({ message: 'Link entry not found' });
    }

    res
      .status(200)
      .json({ message: 'Link updated successfully', data: updatedLink });
  } catch (err) {
    res.status(500).json({ message: 'Error updating link entry', error: err.message });
  }
};


