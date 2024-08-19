<script>
	const linksSetOne = [
		{ title: 'Lady of Code site', path: 'https://ladyofcode.com' },
		{ title: 'Atlantis community', path: 'https://inatlantis.io' },
		{ title: 'Solarpsark', path: 'https://solarspark.au' }
	];

	const linksSetTwo = [
		{ title: 'Twitch', path: 'https://twitch.tv/ladyofcode' },
		{ title: 'Xwitter', path: 'https://twitter.com/ladyofcode' },
		{ title: 'Instagram', path: 'https://instagram.com.ladyofcode' },
		{ title: 'Main TikTok', path: 'https://tiktok.com/@ladyofcode' },
		{ title: 'Guitar TikTok', path: 'https://tiktok.com/@ladyofchord' },
		{ title: 'Sephi (cat) TikTok', path: 'https://tiktok.com/@meowsamune' }
	];
</script>

<footer>
	<div class="content">
		<div class="tag-top" />
		<div class="tag">
			<div class="hole" />
			<h3>Find me online</h3>
			<div class="columns">
				<ul>
					{#each linksSetOne as { path, title }}
						<li>
							<a href={path}>{title}</a>
						</li>
					{/each}
				</ul>

				<ul>
					{#each linksSetTwo as { path, title }}
						<li>
							<a href={path}>{title}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
	<div class="bar"><p>Made with love by Tabs | All right reserved (yes, all of them)</p></div>
</footer>

<style>
	footer {
		font-family: 'Domine', serif;
		height: 100%;
		width: 100%;
		background-color: var(--clr-leather-dark);
		background: radial-gradient(circle, rgb(76, 39, 5) 0%, rgb(45, 22, 1) 93%);
	}

	h3 {
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.64);
		font-size: 2rem;
	}

	.content {
		padding: var(--space-lg);
		width: 100%;
		max-width: var(--width-site);
		margin: 0 auto;
		height: 100%;
		filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.4)) drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.6));
	}

	.tag {
		width: fit-content;
		background: rgb(249, 233, 202);
		background: radial-gradient(
			circle,
			rgba(249, 233, 202, 1) 0%,
			rgba(243, 227, 196, 1) 45%,
			rgba(229, 212, 180, 1) 66%,
			rgba(217, 199, 166, 1) 83%,
			rgba(189, 170, 135, 1) 100%
		);
		clip-path: polygon(0 40px, 40px 0, 100% 0, 100% 100%, 40px 100%, 0 calc(100% - 40px));
		padding: 2rem 80px 2rem 120px;
		position: relative;
	}

	.hole,
	.hole::before,
	.hole::after {
		position: absolute;
		border-radius: 50%;
	}

	.hole {
		width: 60px;
		height: 60px;
		background-color: #853608;
		left: 30px;
		top: calc(50% - 30px);
		filter: drop-shadow(0px 2px 1px rgba(0, 0, 0, 0.6));
	}

	.hole:before {
		content: '';
		height: 20px;
		width: 20px;
		top: calc(50% - 10px);
		left: calc(50% - 10px);
		background-color: #321902;
		filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 1))
			drop-shadow(0px -1px 1px rgba(255, 255, 255, 0.8));
	}

	.columns {
		display: flex;
		flex-direction: column;
	}

	.bar {
		width: 100%;
		padding: var(--space-xl) var(--space-md);
		max-width: var(--width-site);
		margin: 0 auto;
		text-align: center;
		color: rgba(249, 233, 202, 0.6);
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin-top: 1.2rem;
	}

	ul:first-of-type {
		margin-right: 4rem;
	}

	li a {
		width: 100%;
		text-decoration: none;
		color: rgba(0, 0, 0, 0.64);
	}

	li a:hover {
		font-weight: bold;
		text-decoration: underline dashed;
	}

	@media (min-width: 800px) {
		.columns {
			flex-direction: row;
		}

		ul:last-of-type() {
			margin-top: 0;
		}

		.tag {
			padding: 2.4rem 80px 2.4rem 120px;
		}

		/* .content {
			padding: var(--space-lg) 0;
		} */

		/* ul {
			margin-right: var(--space-xxl);
		} */
	}
</style>
