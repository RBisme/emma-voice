function assignTaskOwner(task) {

   const title =
  (task.taskType || "")
    .toUpperCase();

    if (title.includes("DISPATCH")) {
        return {
            owner_type: "ROLE_OWNER",
            owner: "DISPATCH"
        };
    }

    if (title.includes("CUSTOMER")) {
        return {
            owner_type: "ROLE_OWNER",
            owner: "CUSTOMER_SERVICE"
        };
    }

    if (title.includes("ESTIMATE")) {
        return {
            owner_type: "ROLE_OWNER",
            owner: "SALES"
        };
    }

    return {
        owner_type: "ROLE_OWNER",
        owner: "OWNER"
    };
}

module.exports = {
    assignTaskOwner
};