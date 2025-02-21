import { Setting } from "../models/settingSchema.js";

export const createSetting = async (req, res) => {
  try {
    const {
      category,
      showOnline,
      profileColor,
      showMusic,
      showColorSwitcher,
      showDarkMode,
      showSetting,
      showAboutImageMobile,
      showAboutImageLarger,
      showFooter,
      footer,
      showNavbar,
    } = req.body;

    const setting = await Setting.create({
      category: category || [],
      showOnline,
      profileColor,
      showMusic,
      showColorSwitcher,
      showDarkMode,
      showSetting,
      showAboutImageMobile,
      showAboutImageLarger,
      showFooter,
      footer,
      showNavbar,
    });

    res.status(201).json({message:"Created Successfully", setting});
  } catch (error) {
    res.status(500).json({ message: "Server error. Creation failed." , error });
  }
};



export const getSetting = async (req, res) => {
  const setting = await Setting.findOne();
  res.status(200).json({
    success: true,
    setting,
  });
};


export const updateSetting = async (req, res) => {
  try {
    // Convert incoming values to the correct types
    const newData = {
      category: JSON.parse(req.body.category),
      showOnline: req.body.showOnline === 'true',
      profileColor: req.body.profileColor === 'true',
      showMusic: req.body.showMusic === 'true',
      showColorSwitcher: req.body.showColorSwitcher === 'true',
      showDarkMode: req.body.showDarkMode === 'true',
      showSetting: req.body.showSetting === 'true',
      showAboutImageMobile: req.body.showAboutImageMobile === 'true',
      showAboutImageLarger: req.body.showAboutImageLarger === 'true',
      showFooter: req.body.showFooter === 'true',
      showNavbar: req.body.showNavbar === 'true',
      footer: req.body.footer,
    };

    // Find existing setting
    const existingSetting = await Setting.findOne();

    if (!existingSetting) {
      return res.status(404).json({ message: "Setting not found." });
    }

    // Update setting
    const setting = await Setting.findByIdAndUpdate(
      existingSetting._id,
      newData,
      { new: true }
    );

    res.status(200).json({ message: "Updated successfully", setting });
  } catch (error) {
    res.status(500).json({ message: "Server error during update.", error });
  }
};




