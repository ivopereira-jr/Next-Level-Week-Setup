import { FastifyInstance } from 'fastify';
import { prisma } from './lib/prisma';
import { z } from 'zod';
import dayjs from 'dayjs';

// a funcção exportada do arquivo de routes tem que ser async como abaixo
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

		const completedHabits =
			day?.dayHabits.map(dayHabit => {
				return dayHabit.habit_id;
			}) ?? [];

		return {
			possibleHabits,
			completedHabits
		};
	});

	app.patch('/habits/:id/toggle', async request => {
		const toggleHabitParams = z.object({
			id: z.string().uuid()
		});

		const { id } = toggleHabitParams.parse(request.params);
		const today = dayjs().startOf('day').toDate();

		let day = await prisma.day.findUnique({
			where: {
				date: today
			}
		});

		if (!day) {
			day = await prisma.day.create({
				data: {
					date: today
				}
			});
		}

		const dayHabit = await prisma.dayHabit.findUnique({
			where: {
				day_id_habit_id: {
					day_id: day.id,
					habit_id: id
				}
			}
		});

		if (dayHabit) {
			await prisma.dayHabit.delete({
				where: {
					id: dayHabit.id
				}
			});
		} else {
			await prisma.dayHabit.create({
				data: {
					day_id: day.id,
					habit_id: id
				}
			});
		}
	});

	app.get('/summary', async request => {
		// quando tiver Query mais complecas, mais condições, relacionamentos e recomendado fazer o SQL na mão (raw)
		// o SQL abaixo e para o SQlite tem que cuidar dependendo do banco que for usar pq cada um tem suas particulariedades intao oq funciona para o SQlite pode nao funcionar para outro

		const summary = await prisma.$queryRaw`
			SELECT
				D.id,
				D.date,
				(
					SELECT 
						cast(count(*) as float)
					FROM day_habits DH
					WHERE DH.day_id = D.id
				) as completed,
				(
					SELECT 
						cast(count(*) as float)
					FROM habit_week_days HWD	
					JOIN habits H
						ON H.id = HWD.habit_id
					WHERE
						HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
						AND H.created_at <= D.date
				) as amount
			FROM days D	
		`;

		return summary;
	});
}

/*
  dayjs ja retorna a data atual intao nao precisa passar ex new Date
  startOf zera a hora e segundos intao independente da hora que criar o habito o startOf vai deixar zerada
  toDate transforma no objeto Date do javascript

	o cast no SELECT e para conver o resultado do count pois o prisma ainda nao suporta o formato do gerado pelo count
*/
