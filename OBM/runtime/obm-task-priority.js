function assignTaskPriority(task) {

    const title =
  (task.taskType || "")
    .toUpperCase();

    if (title.includes("FLOOD")) {
        return { priority: "P1" };
    }

    if (title.includes("FIRE")) {
        return { priority: "P1" };
    }

    if (title.includes("MISSED")) {
        return { priority: "P2" };
    }

    if (title.includes("ESTIMATE")) {
        return { priority: "P2" };
    }

    if (title.includes("REVIEW")) {
        return { priority: "P4" };
    }

    return {
        priority: "P3"
    };
}

module.exports = {
    assignTaskPriority
};