export function unsavedWarning(e) {
    var message = "The tree wasn't saved! Are you sure you want to close tab?";
    e.returnValue = message;
    return message;
}


