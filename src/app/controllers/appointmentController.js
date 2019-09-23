import * as Yup from "yup";
import User from "../models/User";
import Appointment from "../models/appointment";

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Validation error" });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if ID is from a provider
     */
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true
      }
    });

    if (!isProvider) {
      return res.status(401).json({ erro: "ID is not from a provider" });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
