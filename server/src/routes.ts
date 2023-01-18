import { FastifyInstance } from 'fastify';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import dayjs from 'dayjs';

export async function appRoutes(app: FastifyInstance) {
	app.post('/habits', async request => {
		const createhabitBody = z.object({
			title: z.string(),
			weekDays: z.array(z.number().min(0).max(6))
		});

		const { title, weekDays } = createhabitBody.parse(request.body);

		const today = dayjs().startOf('day').toDate();

		await prisma.habit.create({
			data: {
				title,
				created_at: today,
				weekDays: {
					create: weekDays.map(weekday => {
						return {
							week_day: weekday
						};
					})
				}
			}
		});
	});

	app.get('/day', async request => {
		const getDayParams = z.object({
			date: z.coerce.date() // como o front vai enviar a data como string o coerce serve para converter o paramentro recebido para um formato de data tipo new Date
		});

		const { date } = getDayParams.parse(request.query);

		const parsedDate = dayjs(date).startOf('day');
		const weekDay = parsedDate.get('day'); // dia da semana

		const possibleHabits = await prisma.habit.findMany({
			where: {
				created_at: {
					lte: date
				},
				weekDays: {
					some: {
						week_day: weekDay
					}
				}
			}
		});

		const day = await prisma.day.findUnique({
			where: {
				date: parsedDate.toDate()
			},
			include: {
				dayHabits: true
			}
		});

		const completedHabits = day?.dayHabits.map(dayHabit => {
			return dayHabit.habit_id;
		});

		return {
			possibleHabits,
			completedHabits
		};
	});
}

/*
  dayjs ja retorna a data atual intao nao precisa passar ex new Date
  startOf zera a hora e segundos intao independente da hora que vor criado o habito o startOf vai deixar zerada
  toDate transforma no objeto Date do javascript
*/
