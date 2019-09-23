import * as Yup from "yup";
import User from "../models/User";
import File from "../models/file";
import { startOfHour, parseISO, isBefore } from "date-fns";
import Appointment from "../models/appointment";

class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        cancelled_at: null
      },
      order: ["date"],
      attributes: ["id", "date"],
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["id", "path", "url"]
            }
          ]
        }
      ]
    });
    return res.json(appointments);
  }

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

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past dates are not allowed" });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return res.status(400).json({ erro: "Time slot is not available" });
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
