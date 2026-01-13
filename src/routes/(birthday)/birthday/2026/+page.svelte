<svelte:head>
	<title>You're invited...</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Josefin+Sans:wght@200;300;400;500;600&family=Paytone+One&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="page">
	<div class="invitation">
		<div class="intro">
			<h2 class="guest-name">Dearest GuestName</h2>
			<p class="preamble">
				You are invited for a casual, non-murderous (<em>rather murderous, actually</em>) birthday
				evening for a...
			</p>
			<h1>Murder at the Bourbon Club</h1>
		</div>

		<div class="description">
			<h2 class="headline">The mystery: A jazz club</h2>
			<p>Murder wasn't on Mitzy Saxon's setlist.</p>

			<input type="checkbox" id="expand-description" class="expand-toggle" />
			<div class="expandable-content">
				<p>
					The year is 1950 and it's a night like any other at Bourbon Jazz Club – the epitome of
					sophistication and allure. The Bourbon is the hottest of hot spots for the local
					glitterati, the biggest celebrities and those who are lucky enough to join them. This
					exclusive hotspot is where the crème de la crème of the glitterati, A-list celebrities,
					and aspiring stars come to bask in the limelight. But beware, beneath the glamorous façade
					hides lies, secrets, scandal and murderous intentions!
				</p>
				<p>
					Just as the sultry and mesmerizing Mitsy Saxon takes the stage, her voice weaving its
					magic through the crowd, a piercing scream shatters the air. Chaos ensues as it becomes
					apparent that a heinous crime has been committed within the very walls of our beloved
					club. The doors are swiftly locked, sealing everyone inside, transforming this glamorous
					haven into a captivating crime scene.
				</p>
				<p>
					With no escape until the murderer is unmasked, you must channel your inner detective to
					uncover the truth. Every guest is a potential suspect, and every corner of the club holds
					a clue waiting to be discovered.
				</p>
				<p>
					Can you unravel the secrets hidden within Bourbon Jazz Club and bring the killer to
					justice?
				</p>
			</div>
			<label for="expand-description" class="expand-label"></label>
		</div>

		<div class="details">
			<h2>Details</h2>
			<p>
				This a 'mingle' style mystery instead of a sit-down dinner, where guests can move around and
				chat while the food is being served.
			</p>
			<p><strong>Date:</strong> Saturday, 8th February, 2026</p>
			<p><strong>Time:</strong> 18:00, murder mystery at 18:30</p>
			<p><strong>Location:</strong> Tabs' House</p>
			<p><strong>Dress code:</strong> 1950s evening wear</p>
		</div>

		<div class="dietary">
			<h2>Menu and dietary reqs</h2>
			<p>
				I'll be making a 1950s-inspired menu including devilled eggs, chicken pot pie, angel cake,
				profiteroles, fruit jelly, and more. Subject to change, ofc. So there's no need to bring
				food! Ironically, alcohol won't be served (BYO after the mystery is solved if you like).
			</p>
			<p>
				Please let me know if you have any dietary requirements. I start prepping the menu two weeks
				before the event.
			</p>
		</div>

		<div class="rsvp">
			<h2>Will you attend?</h2>
			<p>
				I'd love to see you there! I'd appreciate RSVPs by the 24th of January in order for me to
				allocate characters and allow guests enough time to prepare any outfits.
			</p>
			<div class="buttons">
				<button class="btn btn-no">I regret</button>
				<button class="btn btn-yes">I Accept</button>
			</div>
		</div>
	</div>
</div>

<style>
	.page {
		font-family: 'Jost', sans-serif;
		background-image: linear-gradient(#040404e1, #040404e1), url('/images/birthday/vintage-tile-2026.jpg');
		background-repeat: repeat;
		background-size: 300px;
		min-height: 100vh;
		padding: 1rem 0;
	}
	p {
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 4.8rem;
		font-family: 'Paytone One', sans-serif;
		text-transform: uppercase;
		line-height: 4rem;
	}

	h2,
	.guest-name {
		font-weight: 200;
		text-transform: uppercase;
		letter-spacing: 0.4rem;
	}

	h2 {
		font-size: 1.4rem;
		font-family: 'Josefin Sans', sans-serif;
		color: #f1e6e6;
		margin-bottom: 1rem;
		margin-top: 1rem;
	}

	.invitation {
		max-width: 720px;
		margin: 0 auto;
		padding: 10px;
		position: relative;
		color: #f1e6e6;
		background-image: url('/images/birthday/vintage-tile-2026.jpg');
		background-size: 300px;
	}

	.intro {
		text-align: center;
		padding: 2rem;
		background-color: #040404e1;
		position: relative;
		overflow: hidden;
	}

	.description,
	.details,
	.dietary,
	.rsvp {
		margin-top: 8px;
		background-color: #6f0505d1;
		padding: 1rem;
		position: relative;
		overflow: hidden;
	}

	.intro::after,
	.description::before,
	.details::before {
		content: '';
		position: absolute;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 0 L27 23 L50 25 L27 27 L25 50 L23 27 L0 25 L23 23 Z' fill='%23f1e6e6'/%3E%3Cpath d='M60 20 L61.5 33 L75 35 L61.5 37 L60 50 L58.5 37 L45 35 L58.5 33 Z' fill='%23f1e6e6'/%3E%3Cpath d='M80 5 L81 13 L90 15 L81 17 L80 25 L79 17 L70 15 L79 13 Z' fill='%23f1e6e6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		opacity: 0.5;
		pointer-events: none;
	}

	.intro::before {
		content: '';
		position: absolute;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 150 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 10 L18 33 L40 36 L18 39 L15 62 L12 39 L-10 36 L12 33 Z' fill='%23f1e6e6'/%3E%3Cpath d='M70 60 L72 75 L88 78 L72 81 L70 96 L68 81 L52 78 L68 75 Z' fill='%23f1e6e6'/%3E%3Cpath d='M25 130 L26 138 L35 140 L26 142 L25 150 L24 142 L15 140 L24 138 Z' fill='%23f1e6e6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		opacity: 0.5;
		pointer-events: none;
		width: 40%;
		height: 40%;
		top: 0;
		left: 1rem;
	}

	.intro::after {
		width: 70px;
		height: 56px;
		top: 1rem;
		right: 1.5rem;
	}

	.description::before {
		width: 55px;
		height: 44px;
		top: 0.5rem;
		right: 1rem;
	}

	.details::before {
		width: 80px;
		height: 64px;
		bottom: 0.5rem;
		right: 1rem;
		top: auto;
		transform: scaleX(-1);
	}

	.dietary::before,
	.dietary::after,
	.rsvp::before {
		content: '';
		position: absolute;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L54 46 L100 50 L54 54 L50 100 L46 54 L0 50 L46 46 Z' fill='%23f1e6e6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		opacity: 0.5;
		pointer-events: none;
	}

	.dietary::before {
		width: 24px;
		height: 24px;
		top: 0.75rem;
		right: 1rem;
	}

	.dietary::after {
		width: 16px;
		height: 16px;
		bottom: 1rem;
		left: 1.5rem;
	}

	.rsvp::before {
		width: 20px;
		height: 20px;
		top: 1rem;
		right: 1.5rem;
	}

	.guest-name {
		font-family: 'Josefin Sans', sans-serif;
		padding: 1rem 0 0 0;
		font-size: 1.4rem;
	}

	.preamble {
		max-width: 400px;
		margin: 0 auto;
		margin-bottom: 1rem;
	}

	.expand-toggle {
		display: none;
	}

	.expandable-content {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.expand-toggle:checked ~ .expandable-content {
		display: block;
		-webkit-line-clamp: unset;
	}

	.expand-label {
		font-weight: bold;
		cursor: pointer;
		display: inline-block;
		margin-top: 0.5rem;
	}

	.expand-label::after {
		content: 'Read more...';
	}

	.expand-toggle:checked ~ .expand-label::after {
		content: 'See less';
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}

	.btn {
		font-family: 'Josefin Sans', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 0.75rem 2rem;
		border: 2px solid #f1e6e6;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-yes {
		background: #f1e6e6;
		color: #880c0c;
	}

	.btn-yes:hover {
		background: transparent;
		color: #f1e6e6;
	}

	.btn-no {
		background: transparent;
		color: #f1e6e6;
	}

	.btn-no:hover {
		background: #f1e6e6;
		color: #880c0c;
	}
</style>
