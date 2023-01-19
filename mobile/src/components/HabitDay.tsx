import {
	Dimensions,
	TouchableOpacity,
	TouchableOpacityProps
} from 'react-native';

const week_days = 7;
const screen_horizontal_padding = (32 * 2) / 5;

export const day_margin_between = 8;
export const day_size =
	Dimensions.get('screen').width / week_days - (screen_horizontal_padding + 5);

interface HabitDayProps extends TouchableOpacityProps {}

export function HabitDay({ ...rest }: HabitDayProps) {
	return (
		<TouchableOpacity
			className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
			style={{ width: day_size, height: day_size }}
			activeOpacity={0.7}
			{...rest}
		/>
	);
}
