import { h } from 'preact';
import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import { PlayerEvent, IPlayerState } from '@eyevinn/web-player-core';
import classNames from 'classnames';
import Logo from './components/logo/Logo';
import Timeline from './components/timeline/Timeline';
import PlayPauseButton from './components/buttons/PlayPauseButton';
import style from './skin.module.css';

function usePlayerState(player) {
	const [state, setState] = useState<IPlayerState | null>(null);
	useEffect(() => {
		player.on(PlayerEvent.STATE_CHANGE, ({ state }) => {
			setState({
				...state,
			});
		});
	}, []);
	return state;
}

export default function EyevinnSkin({ player }) {
	const playerState = usePlayerState(player);
	const togglePlayPause = useCallback(
		() => (player.isPlaying ? player.pause() : player.play()),
		[]
	);

	const timeoutRef = useRef(null);
	const [isUserActive, setIsUserActive] = useState(true);
	const onMouseMove = useCallback(() => setIsUserActive(true), []);
	useEffect(() => {
		if (isUserActive) {
			timeoutRef.current = setTimeout(() => setIsUserActive(false), 2500);
			return () => clearTimeout(timeoutRef.current);
		}
	}, [isUserActive]);

	const seek = useCallback((percentage) => player.seekTo({ percentage }), []);
	return (
		<div class={classNames(style.container, { [style.hidden]: !isUserActive })} onMouseMove={onMouseMove}>
			<Logo />
			<div class={style.bottomContainer}>
				<div class={style.controls}>
					<PlayPauseButton
						playbackState={playerState?.playbackState}
						onClick={togglePlayPause}
					/>
				</div>
				<Timeline
					onSeek={seek}
					currentTime={playerState?.currentTime}
					duration={playerState?.duration}
				/>
			</div>
		</div>
	);
}
