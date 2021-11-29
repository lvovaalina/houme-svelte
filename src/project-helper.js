export function setProjectJobs(project, jobs) {
    let wallJobs = jobs
        .filter(j => j.StageName.toLowerCase() == 'walls'
            && j.WallMaterial.toLowerCase() == project.WallMaterial.toLowerCase());

    let foundationJobs = jobs
        .filter(j => j.StageName.toLowerCase() == 'foundation'
            && j.FoundationMaterial.toLowerCase() == project.FoundationMaterial.toLowerCase());

    let finishJobs = jobs
        .filter(j => j.StageName.toLowerCase() == 'exterior decoration of the house'
            && j.FinishMaterial.toLowerCase() == project.FinishMaterial.toLowerCase());

    let roofingJobs = jobs
        .filter(j => j.StageName.toLowerCase() == 'roof'
            && j.RoofingMaterial.toLowerCase() == project.RoofingMaterial.toLowerCase());

    let projectJobs = jobs.filter(j => j.Required == true);
    projectJobs = projectJobs.concat(wallJobs);
    projectJobs = projectJobs.concat(foundationJobs);
    projectJobs = projectJobs.concat(roofingJobs);
    projectJobs = projectJobs.concat(finishJobs);

    let projectJobsModel = [];
    projectJobs.forEach(element => {
        projectJobsModel.push({
            ...element,
            Job: element,
        });
    });

    project.ProjectJobs = projectJobsModel;
    return project;
}