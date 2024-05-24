const modelCapabilites = [
    'Maintenance, strength, entertainment.',
    'Security, maintenance, strength.',
    'Hospitality, errands, psychology.',
    'Security, maintenance, errands.',
    'Hospitality, errands, security, strength, psychology, entertainment.',
    'Hospitality, psychology, entertainment.',
];

const modelDescriptions = [
    "Founded in 1992 by MIT researchers, Boston Dynamics has been at the forefront of robotic innovation, consistently pushing the boundaries of what robots can achieve. The first iteration of the Atlas was introduced in 2013, marking a significant milestone in the field of robotics. Since then, the Atlas line has undergone several iterations, each incorporating advancements in technology and design. With the introduction of the Atlas V, Boston Dynamics continues to innovate and redefine the capabilities of humanoid robots, setting new standards for versatility and performance.",
    "Hahne-Kedar's Tempest embodies strength and dependability, designed to excel in security and maintenance roles in challenging environments. Established in 2030, Hahne-Kedar quickly gained recognition for producing rugged and reliable robots capable of thriving in demanding conditions. Tempest's robust construction and advanced capabilities make it a valuable asset for tasks ranging from patrolling perimeters to tackling physically demanding assignments. Hahne-Kedar's dedication to engineering excellence is evident in Tempest, marking the company as a leader in the development of rugged robotics solutions.",
    "iRobot's LifeMate epitomizes the seamless integration of robotics into everyday life, offering hospitality services, practical assistance, and psychological support. Founded in 1990, iRobot has been a pioneer in consumer robotics, striving to enhance human experiences through innovative technology. LifeMate embodies this vision by providing a range of services tailored to enrich daily life, from household chores to companionship. iRobot's dedication to innovation and improving human well-being is evident in the multifunctional LifeMate, marking a significant advancement in the company's robotics portfolio.",
    "NovaGen's NGX-2000 is a symbol of reliability and security, equipped with advanced AI to execute maintenance tasks and ensure safety in diverse environments. Established in 2010, NovaGen Technologies has established itself as a leader in providing cutting-edge AI solutions for various applications. NGX-2000's precision in executing tasks and its role as a guardian of security reflect NovaGen's commitment to excellence in robotics, positioning the company as a frontrunner in the field of advanced robotics technology.", 
    "Seraph AI's Aegis VII emanates a divine aura, seamlessly weaving together a plethora of functions to attend to a vast array of human needs. With an elegance that transcends this world, Aegis VII stands ready to flawlessly fulfill any appointed duty. Founded in 2024, Seraph AI swiftly ascended to prominence for its visionary approach to robotics, propelled by advanced AI and a profound comprehension of human-centric design principles. Aegis VII's capacity to fulfill diverse tasks with apparent celestial grace marks a paradigm shift in the realm of AI robotics, where technology harmoniously converges with human interaction, akin to a phenomenon beyond the realms of conventional understanding.",
    "Toyota's HSR-3 represents a convergence of hospitality, psychological understanding, and entertainment, extending the company's commitment to enhancing human mobility and well-being into the realm of robotics. Leveraging Toyota's expertise in automotive technology since 1937, the HSR-3 embodies a versatile companion capable of assisting with various tasks while providing companionship and entertainment. Toyota's dedication to innovation shines through with the HSR-3, showcasing the company's ongoing efforts to redefine the role of technology in society."
]

const modal = () => {

    $('body').on('click', '.companyCard', function (e) {
        const roboName = $(this).attr('roboName');
        const companyName = $(this).attr('company');
        const id = $(this).attr('roboID');

        $('.modal-body').html(`
    <div>
        <div class="text-center">
            <img class="text-center" src="img/robots/${roboName}.png" alt="${roboName}">
        </div>
        <div>
            <h4>Abilities</h3>
            ${modelCapabilites[id - 1]}
        </div>
        <div>
            <h4>Description</h3>
            ${modelDescriptions[id - 1]}
        </div>
    </div>
    `)
        $('.modal-title').html(`
    <h2>${companyName} ${roboName.toUpperCase()}</h2>
    `)
    })

}

modal();