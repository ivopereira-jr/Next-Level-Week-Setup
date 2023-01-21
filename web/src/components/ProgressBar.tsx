interface ProgressBarProps {
	progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
	return (
		<div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
			<div
				className="h-3 rounded-xl bg-violet-600 w-3/4 transition-all ease-linear duration-200"
				role="progressbar"
				aria-label="Progresso de hábitos completados no dia"
				aria-aria-valuenow={progress}
				style={{
					width: `${progress}%`
				}}
			></div>
		</div>
	);
}
