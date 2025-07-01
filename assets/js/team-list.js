document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    var CARDS_PER_ROW = 4;
    var teamMembers = document.getElementsByClassName('team-member-card');

    function is_mobile() {
        return window.innerWidth <= 1200;
    }

    function expandTeamMember(node, height) {
        var index = Array.prototype.indexOf.call(teamMembers, node);
        var row = Math.floor(index / CARDS_PER_ROW);
        var baseIndex = row * CARDS_PER_ROW;
        var column = index - baseIndex;
        node.style.height = height + 'px';
        if (column === 0) {
            teamMembers[baseIndex + 1].classList.add('hidden')
            node.style.gridColumnStart = 1;
            node.style.gridColumnEnd = 3;
        } else if (column < CARDS_PER_ROW / 2) {
            teamMembers[baseIndex + column + 1].classList.add('hidden')
            node.style.gridColumnStart = column + 1;
            node.style.gridColumnEnd = column + 3;
        } else {
            teamMembers[baseIndex + column - 1].classList.add('hidden')
            node.style.gridColumnStart = column;
            node.style.gridColumnEnd = column + 2;
        }
    }

    function hideOpenTeamMember() {
        for (var i = 0, l = teamMembers.length; i < l; ++i) {
            var member = teamMembers[i];
            if (member.classList.contains('selected')) {
                member.classList.remove('selected');
                member.style.gridColumnStart = 'initial';
                member.style.gridColumnEnd = 'initial';
                member.style.height = 'initial';
            } else if (member.classList.contains('hidden') && !member.classList.contains('fake')) {
                member.classList.remove('hidden');
            }
        }
    }

    function showTeamMember(event) {
        var node = event.currentTarget;
        var height = node.clientHeight;
        var isSelected = node.classList.contains('selected');
        hideOpenTeamMember();
        if (!isSelected) {
            node.classList.add('selected');
            if (!is_mobile()) {
                expandTeamMember(node, height);
            }
        }
    }

    for (var i = 0, l = CARDS_PER_ROW - teamMembers.length % CARDS_PER_ROW; i < l; ++i) {
        var fake = document.createElement('section');
        fake.classList.add('team-member-card');
        fake.classList.add('hidden');
        fake.classList.add('fake');
        var cardLists = document.getElementsByClassName('team-list-cards');
        if (cardLists[0]) {
            cardLists[0].appendChild(fake);
        }
    }
    for (var i = 0, l = teamMembers.length; i < l; ++i) {
        teamMembers[i].addEventListener('click', showTeamMember);
        teamMembers[i].addEventListener('keydown', function(e) {
            if (e.key == 'Enter') {
                showTeamMember(e);
            } else if (e.key == 'Escape') {
                hideOpenTeamMember();
            }
        });
    }
});
