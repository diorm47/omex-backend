import DataModel from "../models/datas.js";

export const getAll = async (req, res) => {
  try {
    const dataEntries = await DataModel.find().exec();
    res.json(dataEntries);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error while getting data entries!" });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new DataModel({
      timer: req.body.timer,
      token: req.body.token,
      tokenomics_link: req.body.tokenomics_link,
      whitepaper_link: req.body.whitepaper_link,
      whitepaper_text: req.body.whitepaper_text,
    });

    const dataEntry = await doc.save();
    res.json(dataEntry);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error while saving data entry!" });
  }
};

export const remove = async (req, res) => {
  try {
    const dataId = req.params.id;
    const doc = await DataModel.findByIdAndDelete(dataId);

    if (!doc) {
      return res.status(404).json({ message: "Data entry not found!" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error while removing data entry!" });
  }
};

export const update = async (req, res) => {
  try {
    const dataId = req.params.id;
    await DataModel.updateOne(
      { _id: dataId },
      {
        timer: req.body.timer,
        token: req.body.token,
        tokenomics_link: req.body.tokenomics_link,
        whitepaper_link: req.body.whitepaper_link,
        whitepaper_text: req.body.whitepaper_text,
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error while updating data entry!" });
  }
};
