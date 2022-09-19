import { GameConfig } from "../../GameBase/GameConfig";

export default class GameHelper {
    static hasClubPermission(role) {
        switch(role) {
            case GameConfig.ROLE.MANAGER:
            case GameConfig.ROLE.OWNER:
                return true;
            case GameConfig.ROLE.USER:
            case GameConfig.ROLE.PROXY:
                return false;      
        }
        return false;
    }
}